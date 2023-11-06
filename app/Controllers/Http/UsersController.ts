import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserService from 'App/Services/UserService'
import LoginUserValidator from 'App/Validators/User/LoginUserValidator'
import RegisterUserValidator from 'App/Validators/User/RegisterUserValidator'
import UpdateUserValidator from 'App/Validators/User/UpdateUserValidator'
import UploadAvatarUserValidator from 'App/Validators/User/UploadAvatarUserValidator'

export default class UsersController {
  public async index({ bouncer, acl }: HttpContextContract) {
    await bouncer.with('UserPolicy').forUser(acl).authorize('viewList')

    return await User.query().preload('profile', (query) => query.preload('avatar'))
  }

  public async show({ acl, auth, params, bouncer }: HttpContextContract) {
    const id = !params.id || params.id === 'me' ? auth.user!.id : params.id
    const user = await User.findOrFail(id)

    await bouncer.with('UserPolicy').forUser(acl).authorize('view', user)

    await user.load('profile', (query) => query.preload('avatar'))

    return user
  }

  public async update({ request, auth, params, acl, bouncer }: HttpContextContract) {
    const payload = await request.validate(UpdateUserValidator)

    const id = !params.id || params.id === 'me' ? auth.user!.id : params.id
    let user = await User.findOrFail(id)

    await bouncer.with('UserPolicy').forUser(acl).authorize('update', user)

    user = await UserService.update(user, payload)

    return user
  }

  public async register({ request }: HttpContextContract) {
    const payload = await request.validate(RegisterUserValidator)

    await UserService.register(payload)

    return {
      status: true,
    }
  }

  public async login({ request, auth }: HttpContextContract) {
    const payload = await request.validate(LoginUserValidator)

    await UserService.login(auth, payload)

    return auth.user!.toJSON()
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('web').logout()
    response.status(200).redirect('/api/users/login')
  }

  public async isLoggedIn({ auth }: HttpContextContract) {
    return auth.isLoggedIn
  }

  public async uploadAvatar({ auth, request }: HttpContextContract) {
    const payload = await request.validate(UploadAvatarUserValidator)

    return await UserService.uploadAvatar(payload, auth.user!)
  }
}
