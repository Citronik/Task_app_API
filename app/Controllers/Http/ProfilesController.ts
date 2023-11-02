import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import Profile from 'App/Models/Profile'
import UpdateProfile from 'App/Validators/UpdateProfileValidator'
import UploadsController from './UploadsController'

export default class ProfilesController {
  public async showMyProfile ({ response, auth }: HttpContextContract){
    console.log('showing profile')
    const user = await User.findOrFail(auth.user?.id)
    if (!user) {
      return response.status(404).json({
        status: 'failed',
        message: 'User not found',
      })
    }
    await user.load('profile')
    if (!user.profile) {
      return response.status(404).json({
        status: 'failed',
        message: 'User not found',
      })
    }
    await user.profile.load('avatar')
    //console.log(user.profile)
    return response.status(200).json({
      status: 'success',
      message: 'User profile',
      data: user.profile,
    })
  }

  public async update ({ request, response, auth }: HttpContextContract){
    console.log('updating profile')
    const user = await User.find(auth.user?.id)
    if (!user) {
      return response.status(404).json({
        status: 'failed',
        message: 'User not found',
      })
    }
    const profile = await Profile.findBy('user_id', user.id)
    if (!profile) {
      return response.status(404).json({
        status: 'failed',
        message: 'Profile not found',
      })
    }
    const payload = await request.validate(UpdateProfile)
    profile.bio = payload.bio ? payload.bio : null
    console.log(request.file('file'))
    if (request.file('file')) {
      const uploadController = new UploadsController()
      const upload = await uploadController.upload({request} as HttpContextContract)
      if (!upload) {
        return response.status(404).json({
          status: 'failed',
          message: 'Upload file failed',
        })
      }
      await profile.related('avatar').associate(upload)
    }
    try {
      await profile.save()
      return response.status(200).json({
        status: 'success',
        message: 'User profile',
        data: profile.toJSON(),
      })
    } catch (error) {
      console.log('profile upload', error)
      return response.status(200).json({
        status: 'failed',
        message: 'Profile failed',
      })
    }
  }
}
