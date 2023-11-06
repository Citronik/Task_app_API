import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Room from 'App/Models/Room'
import MessageRepository from 'App/Repositories/MessageRepository'
import MessageService from 'App/Services/MessageService'
import CreateMessageValidator from 'App/Validators/Message/CreateMessageValidator'
import IndexMessageValidator from 'App/Validators/Message/IndexMessageValidator'

export default class MessagesController {
  public async index({ acl, request, params, bouncer }: HttpContextContract) {
    const payload = await request.validate(IndexMessageValidator)

    const room = await Room.findOrFail(params.id)
    await bouncer.with('MessagePolicy').forUser(acl).authorize('viewList', room)

    const messages = await MessageRepository.get({
      ...payload,
      roomId: params.id,
    }).paginate(payload.page ?? 1, payload.perPage ?? 20)

    return messages
  }

  public async show({ acl, params, bouncer }: HttpContextContract) {
    const room = await Room.findOrFail(params.id)

    const message = await MessageRepository.getById(params.message_id).firstOrFail()
    await bouncer.with('MessagePolicy').forUser(acl).authorize('view', message, room)

    return message
  }

  public async store({ acl, auth, request, params, bouncer }: HttpContextContract) {
    const payload = await request.validate(CreateMessageValidator)

    const room = await Room.findOrFail(params.id)
    await bouncer.with('MessagePolicy').forUser(acl).authorize('create', room)

    const message = await MessageService.create(payload, room, auth.user!)

    return message
  }

  public async destroy({ acl, params, auth, bouncer }: HttpContextContract) {
    const room = await Room.findOrFail(params.id)
    const message = await MessageRepository.getById(params.message_id).firstOrFail()

    await bouncer.with('MessagePolicy').forUser(acl).authorize('delete', message, room)

    const status = await MessageService.delete(message, auth.user!)

    return {
      status,
    }
  }
}
