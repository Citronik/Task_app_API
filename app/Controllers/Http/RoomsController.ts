import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Room from 'App/Models/Room'
import User from 'App/Models/User'
import CreateRoom from 'App/Validators/Room/CreateRoomValidator'
import UploadsController from './UploadsController'

export default class RoomsController {
  public async create ({ request, response, auth }){
    console.log('Create Room')
    const user = await User.findOrFail(auth.user.id)
    const payload = await request.validate(CreateRoom)
    const room = new Room()
    room.merge(payload)
    await user.related('room').save(room)
    if (request.file('file')) {
      console.log('Uploading file')
      const uploadController = new UploadsController()
      const upload = await uploadController.upload(request)
      if (!upload) {
        return response.status(404).json({
          status: 'failed',
          message: 'Upload file failed',
        })
      }
      await room.related('photo').associate(upload)
    }
    return room
  }

  public async getAllMyRooms ({ auth }) {
    console.log('Get all rooms')
    const user = await User.findOrFail(auth.user.id)
    const rooms = await user.related('room').query()
    return rooms
  }

  public async getRoom ({ params, bouncer }) {
    console.log('Get a '+ params.id +' Room')
    const room = await Room.findOrFail(params.id)
    await bouncer.with('RoomPolicy').authorize('view', room)
    return room
  }

  public async update ({ request, response, params, bouncer, auth }: HttpContextContract) {
    console.log('Update a '+ params.id +' Room')
    const user = await User.findOrFail(auth.user?.id)
    const room = await Room.findOrFail(params.id)
    await bouncer.with('RoomPolicy').authorize('update', room)
    const payload = await request.validate(CreateRoom)
    room.merge(payload)
    await user.related('room').save(room)
    if (request.file('file')) {
      console.log('Uploading file')
      const uploadController = new UploadsController()
      const upload = await uploadController.upload({ request } as HttpContextContract)
      if (!upload) {
        return response.status(404).json({
          status: 'failed',
          message: 'Upload file failed',
        })
      }
      await room.related('photo').associate(upload)
    }
    return room
  }

  public async delete ({ params, bouncer }) {
    console.log('Delete a '+ params.id +' Room')
    const room = await Room.findOrFail(params.id)
    await bouncer.with('RoomPolicy').authorize('update', room)
    //await Message.query().where('room_id', room.id).delete();
    //await Task.query().where('room_id', room.id).delete();
    await room.delete()
    return room
  }
}
