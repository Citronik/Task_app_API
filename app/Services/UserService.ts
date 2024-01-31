import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import Hash from '@ioc:Adonis/Core/Hash'
import Database from '@ioc:Adonis/Lucid/Database'
import { InvalidCredentialsException } from 'App/Exceptions/User'
import User, { AvatarConfig } from 'App/Models/User'
import { LoginUserValidatorProps } from 'App/Validators/User/LoginUserValidator'
import { RegisterUserValidatorProps } from 'App/Validators/User/RegisterUserValidator'
import { UpdateUserValidatorProps } from 'App/Validators/User/UpdateUserValidator'
import { UploadAvatarUserValidatorProps } from 'App/Validators/User/UploadAvatarUserValidator'
import ConstantsService from './ConstantsService'
import FileService from './FileService'
import { CreateUserValidatorProps } from 'App/Validators/User/CreateUserValidator'

class UserService {
  public async register(data: RegisterUserValidatorProps) {
    const user = new User()
    user.merge({ ...data, roleId: ConstantsService.getDefaultRole().id })

    await Database.transaction(async (trx) => {
      user.useTransaction(trx)
      await user.save()

      await user.related('profile').create({})
    })

    return user
  }

  public async login(auth: AuthContract, data: LoginUserValidatorProps) {
    const user = await User.query()
      .where((query) => {
        if (data.username) {
          query.where('username', data.username)
        } else if (data.email) {
          query.orWhere('email', data.email)
        }
      })
      .first()

    if (!user || !(await Hash.verify(user.password, data.password))) {
      throw new InvalidCredentialsException()
    }

    await auth.login(user, true)

    await user.load('profile', (query) => query.preload('avatar'))

    return user
  }

  public async create(data: CreateUserValidatorProps) {
    const user = new User()
    user.merge({ ...data, roleId: data.roleId ?? ConstantsService.getDefaultRole().id })

    await Database.transaction(async (trx) => {
      user.useTransaction(trx)
      await user.save()

      await user.related('profile').create({})
    })

    return user
  }

  public async update(user: User, data: UpdateUserValidatorProps) {
    const { bio, ...properties } = data
    user.merge(properties)
    await Database.transaction(async (trx) => {
      user.useTransaction(trx)

      if (bio !== undefined) {
        await user.related('profile').updateOrCreate({ userId: user.id }, { bio })
      }

      await user.save()
    })

    await user.load('profile', (query) => query.preload('avatar'))

    return user
  }

  public async uploadAvatar(data: UploadAvatarUserValidatorProps, user: User) {
    const file = await FileService.create(data.file, AvatarConfig, user)
    await user.related('profile').updateOrCreate({ userId: user.id }, { avatarId: file.id })

    await user.load('profile', (query) => query.preload('avatar'))

    return user
  }
}

export default new UserService()
