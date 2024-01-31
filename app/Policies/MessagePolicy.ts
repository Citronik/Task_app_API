import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Room from 'App/Models/Room'
import User from 'App/Models/User'
import { AclService } from 'App/Services/AclService'
import Message from '../Models/Message'
import Logger from '@ioc:Adonis/Core/Logger'

export default class MessagePolicy extends BasePolicy {
  private async isParticipant(room: Room, user: User) {
    Logger.info('[MessagePolicy] isParticipant')

    return (await room.related('participants').query().where('user_id', user.id).first()) !== null
  }

  public async viewList(acl: AclService, room: Room) {
    Logger.info('[MessagePolicy] viewList')
    return (
      acl.has('messages', 'read') &&
      (room.creatorId === acl.user.id || (await this.isParticipant(room, acl.user)))
    )
  }

  public async view(acl: AclService, message: Message, room: Room) {
    Logger.info('[MessagePolicy] view')

    return (
      acl.has('messages', 'read') ||
      message.userId === acl.user.id ||
      room.creatorId === acl.user.id ||
      (await this.isParticipant(room, acl.user))
    )
  }

  public async create(acl: AclService, room: Room) {
    return (
      acl.has('messages', 'create') ||
      room.creatorId === acl.user.id ||
      (await this.isParticipant(room, acl.user))
    )
  }

  public async delete(acl: AclService, message: Message, room: Room) {
    return (
      acl.has('messages', 'delete') ||
      message.userId === acl.user.id ||
      room.creatorId === acl.user.id
    )
  }
}
