import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RoomRepository from 'App/Repositories/RoomRepository'
import RoomService from 'App/Services/RoomService'
import CreateRoomValidator from 'App/Validators/Room/CreateRoomValidator'
import IndexRoomValidator from 'App/Validators/Room/IndexRoomValidator'
import UpdateRoomValidator from 'App/Validators/Room/UpdateRoomValidator'
import UploadPhotoRoomValidator from 'App/Validators/Room/UploadPhotoRoomValidator'

export default class RoomsController {
  public async index({ acl, request, bouncer }: HttpContextContract) {
    const payload = await request.validate(IndexRoomValidator)

    await bouncer.with('RoomPolicy').forUser(acl).authorize('viewList', payload)

    const rooms = await RoomRepository.get(payload).paginate(
      payload.page ?? 1,
      payload.perPage ?? 20
    )

    return rooms
  }

  public async show({ params, acl, bouncer }: HttpContextContract) {
    const room = await RoomRepository.getById(params.id).firstOrFail()

    await bouncer.with('RoomPolicy').forUser(acl).authorize('view', room)

    return room
  }

  public async store({ request, bouncer, acl, auth }: HttpContextContract) {
    const payload = await request.validate(CreateRoomValidator)

    await bouncer.with('RoomPolicy').forUser(acl).authorize('create')

    const room = await RoomService.create(payload, auth.user!)

    return room
  }

  public async update({ request, acl, params, bouncer, auth }: HttpContextContract) {
    let room = await RoomRepository.getById(params.id).firstOrFail()
    await bouncer.with('RoomPolicy').forUser(acl).authorize('update', room)

    const payload = await request.validate(UpdateRoomValidator)

    room = await RoomService.update(room, payload, auth.user!)

    return room
  }

  public async delete({ auth, acl, params, bouncer }: HttpContextContract) {
    const room = await RoomRepository.getById(params.id).firstOrFail()
    await bouncer.with('RoomPolicy').forUser(acl).authorize('delete', room)

    const status = await RoomService.delete(room, auth.user!)

    return {
      status,
    }
  }

  public async uploadPhoto({ request, auth, acl, params, bouncer }: HttpContextContract) {
    const room = await RoomRepository.getById(params.id).firstOrFail()
    await bouncer.with('RoomPolicy').forUser(acl).authorize('update', room)

    const payload = await request.validate(UploadPhotoRoomValidator)

    return await RoomService.uploadPhoto(room, payload, auth.user!)
  }
}
