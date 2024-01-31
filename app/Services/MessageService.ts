import Database from '@ioc:Adonis/Lucid/Database'
import Message from 'App/Models/Message'
import Room from 'App/Models/Room'
import User from 'App/Models/User'
import { CreateMessageValidatorProps } from 'App/Validators/Message/CreateMessageValidator'

class MessageService {
  public async create(data: CreateMessageValidatorProps, room: Room, user: User) {
    const message = new Message()
    message.merge({
      ...data,
      userId: user.id,
    })

    await Database.transaction(async (trx) => {
      message.useTransaction(trx)
      await message.related('room').associate(room)
      await message.save()
    })

    return message
  }

  public async delete(message: Message, _user: User) {
    await message.delete()

    return true
  }
}

export default new MessageService()
