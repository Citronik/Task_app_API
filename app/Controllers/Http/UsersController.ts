//import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
//import Profile from 'App/Models/Profile'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUser from 'App/Validators/CreateUserValidator'
import LoginUser from 'App/Validators/LoginUserValidator'
import UpdateUser from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async register ({ request }: HttpContextContract) {
    console.log('registration')
    //console.log(request)
    const payload = await request.validate(CreateUser)
    const user = await User.create(payload)
    const profile = await user.related('profile').create({})
    //return this.login(...arguments)
    // return response.status(200).json({
    //   status: 'success',
    //   message: 'User logged in!',
    //   user: user.toJSON(),
    // })
  }

  public async login ({ request, response, auth }: HttpContextContract) {
    console.log('login')
    const payload = await request.validate(LoginUser)

    const {username, email, password} = payload
    console.log(username, email, password)
    const uid = username || email
    if(!uid){
      return response.status(404).json({
        status: 'failed',
        message: 'Unable to login',
      })
    }

    const token =await auth.use('api').attempt(uid, password)
    if (auth.user) {
      await auth.user.load('profile')
      if (auth.user.profile) {
        await auth.user.profile.load('avatar')
      }
    }
    return response.status(200).json({
      status: 'success',
      message: 'User logged in!',
      user: auth.user?.toJSON(),
      token: token.toJSON(),
    })
  }

  public async update ({ request, response, auth } : HttpContextContract) {
    console.log('update')
    const user = await User.find(auth.user?.id)
    //let user = await auth.user
    if (!user) {
      return response.status(404).json({
        status: 'failed',
        message: 'Profile not found',
      })
    }
    const payload = await request.validate(UpdateUser)
    const { firstName, lastName} = payload
    console.log(firstName, lastName)
    user.first_name = firstName ? firstName : user.first_name
    user.last_name = lastName ? lastName : user.last_name
    try {
      await user.save()
      await user.load('profile')
      await user.profile.load('avatar')

      return response.status(200).json({
        status: 'success',
        message: 'User updated!',
        data: user.toJSON(),
      })
    } catch (error) {
      console.log('update user', error)
      return response.status(500).json({
        status: 'error',
        message: error.message,
      })
    }
  }

  public async getAllUsers (){
    return await User.all()
  }

  public async showMe ({ response, auth }: HttpContextContract) {
    console.log('showMe')
    const user = await User.find(auth.user?.id)
    await user?.load('profile')
    //console.log(user)
    if (!user) {
      return response.status(404).json({
        status: 'failed',
        message: 'User not found',
      })
    }
    return response.status(200).json({
      status: 'success',
      message: 'User found',
      data: user.toJSON(),
    })
  }

  public async logout ({ auth, response }) {
    console.log('logout')
    await auth.use('api').logout()
    response.status(200).redirect('/api/users/login')
  }

  public async getOneUser ({ params, response }: HttpContextContract) {
    console.log('getOneUser')
    try {
      const user = await User.find(params.id)
      if (!user) {
        return response.status(404).json({
          status: 'failed',
          message: 'User not found',
        })
      }
      await user.load('profile')
      return response.status(200).json({
        status: 'success',
        message: 'User found',
        data: user.toJSON(),
      })
    } catch (error) {
      console.log('getOneUser', error)
      return response.status(500).json({
        status: 'error',
        message: error.message,
      })
    }
  }

  public async isLoggedIn ({ auth }: HttpContextContract) {
    console.log('isLoggedIn')
    return auth.use('api').isLoggedIn
  }
}
