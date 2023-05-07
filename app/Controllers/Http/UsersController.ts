//import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
//import Profile from 'App/Models/Profile'
import User from 'App/Models/User'
import CreateUser from 'App/Validators/CreateUserValidator'
import LoginUser from 'App/Validators/LoginUserValidator'
import UpdateUser from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async register ({ request, response, auth }) {
    console.log('registration')
    console.log(request)
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

  public async login ({ request, response, auth }) {
    console.log('login')
    const payload = await request.validate(LoginUser)
    const {username, email, password, rememberMeToken} = payload
    console.log(username, email, password)
    const token = !username ? await auth.use('api').attempt(email, password) :
      await auth.use('api').attempt(username, password)
    //console.log(token)
    if (!token) {
      return response.status(404).json({
        status: 'failed',
        message: 'Unable to login',
      })
    }
    return response.status(200).json({
      status: 'success',
      message: 'User logged in!',
      data: token.toJSON(),
    })
  }

  public async update ({ request, response, auth }) {
    console.log('update')
    const user = await User.find(auth.user.id)
    if (!user) {
      return response.status(404).json({
        status: 'failed',
        message: 'Profile not found',
      })
    }
    const payload = await request.validate(UpdateUser)
    const {username, first_name, last_name, password} = payload
    console.log(username, first_name, last_name, password)
    if (username) {
      console.log(username)
      user.username = username
    }if (password) {
      console.log(password)
      user.password = password
    }if (first_name) {
      console.log(first_name)
      user.first_name = first_name
    }if (last_name) {
      console.log(last_name)
      user.last_name = last_name
    }
    try {
      await user.save()
      return response.status(200).json({
        status: 'success',
        message: 'Profile updated!',
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

  public async showMe ({ request, response, auth }) {
    console.log('showMe')
    const user = await User.find(auth.user.id)
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
}
