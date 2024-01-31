import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Room from 'App/Models/Room'
import Task from 'App/Models/Task'
import User from 'App/Models/User'
import { AclService } from 'App/Services/AclService'
import { IndexTaskValidatorProps } from 'App/Validators/Task/IndexTaskValidator'
import Logger from '@ioc:Adonis/Core/Logger'

export default class TaskPolicy extends BasePolicy {
  public async isParticipant(room: Room, user: User) {
    Logger.info('[TaskPolicy] isParticipant')

    return (await room.related('participants').query().where('user_id', user.id).first()) !== null
  }

  // public async viewList(acl: AclService, payload: IndexTaskValidatorProps) {
  //   if (!acl.has('tasks', 'read')) {
  //     payload.userId = acl.user?.id
  //   }

  //   return true
  // }

  public async viewList(acl: AclService, room: Room) {
    Logger.info('[TaskPolicy] viewList')

    return (
      acl.has('tasks', 'read') &&
      (room.creatorId === acl.user.id || this.isParticipant(room, acl.user))
    )
  }

  public async view(acl: AclService, task: Task, room: Room) {
    Logger.info('[TaskPolicy] view')
    return (
      acl.has('tasks', 'read') &&
      (task.creatorId === acl.user.id ||
        task.ownerId === acl.user.id ||
        room.creatorId === acl.user.id ||
        (await this.isParticipant(room, acl.user)))
    )
  }

  public async create(acl: AclService, room: Room) {
    Logger.info('[TaskPolicy] create')
    return (
      acl.has('tasks', 'create') &&
      (room.creatorId === acl.user.id || (await this.isParticipant(room, acl.user)))
    )
  }

  public async update(acl: AclService, task: Task, room: Room) {
    Logger.info('[TaskPolicy] update')
    return (
      acl.has('tasks', 'update') &&
      (task.creatorId === acl.user.id || room.creatorId === acl.user.id)
    )
  }

  public async delete(acl: AclService, task: Task, room: Room) {
    Logger.info('[TaskPolicy] delete')
    return (
      acl.has('tasks', 'delete') &&
      (task.creatorId === acl.user.id || room.creatorId === acl.user.id)
    )
  }
}
