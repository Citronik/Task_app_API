import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Room from 'App/Models/Room'
import User from 'App/Models/User'
import { AclService } from 'App/Services/AclService'
import { IndexRoomValidatorProps } from 'App/Validators/Room/IndexRoomValidator'

export default class RoomPolicy extends BasePolicy {
  private async isParticipant(room: Room, user: User) {
    return (await room.related('participants').query().where('user_id', user.id).first()) !== null
  }

  public async viewList(acl: AclService, payload: IndexRoomValidatorProps) {
    if (!acl.has('rooms', 'read')) {
      payload.userId = acl.user?.id
    }

    return true
  }

  public async view(acl: AclService, room: Room) {
    return (
      acl.has('rooms', 'read') &&
      (room.creatorId === acl.user.id || (await this.isParticipant(room, acl.user)))
    )
  }

  public async create(acl: AclService) {
    return acl.has('rooms', 'create')
  }

  public async update(acl: AclService, room: Room) {
    return acl.has('rooms', 'update') && room.creatorId === acl.user.id
  }

  public async delete(acl: AclService, room: Room) {
    return acl.has('rooms', 'delete') && room.creatorId === acl.user.id
  }
}
