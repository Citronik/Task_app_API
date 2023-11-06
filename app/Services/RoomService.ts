import Database from '@ioc:Adonis/Lucid/Database'
import Room, { PhotoConfig } from 'App/Models/Room'
import User from 'App/Models/User'
import { CreateRoomValidatorProps } from 'App/Validators/Room/CreateRoomValidator'
import { UpdateRoomValidatorProps } from 'App/Validators/Room/UpdateRoomValidator'
import { UploadPhotoRoomValidatorProps } from 'App/Validators/Room/UploadPhotoRoomValidator'
import FileService from './FileService'

class RoomService {
  public async create(data: CreateRoomValidatorProps, user: User) {
    const room = new Room()

    room.merge({ ...data, creatorId: user.id })

    await Database.transaction(async (trx) => {
      room.useTransaction(trx)
      await room.save()
    })

    return room
  }

  public async update(room: Room, data: UpdateRoomValidatorProps, _user: User) {
    room.merge({ ...data })

    await Database.transaction(async (trx) => {
      room.useTransaction(trx)
      await room.save()
    })

    await room.load('photo')

    return room
  }

  public async delete(room: Room, _user: User) {
    await room.delete()

    return true
  }

  public async uploadPhoto(room: Room, data: UploadPhotoRoomValidatorProps, user: User) {
    const file = await FileService.create(data.file, PhotoConfig, user)
    room.photoId = file.id

    await room.save()

    await room.load('photo')

    return room
  }
}

export default new RoomService()
