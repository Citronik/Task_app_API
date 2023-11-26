import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Room from 'App/Models/Room'
import Task from 'App/Models/Task'
import { AclService } from 'App/Services/AclService'
import { IndexTaskValidatorProps } from 'App/Validators/Task/IndexTaskValidator'

export default class TaskPolicy extends BasePolicy {
  public async viewList(acl: AclService, payload: IndexTaskValidatorProps) {
    if (!acl.has('tasks', 'read')) {
      payload.userId = acl.user?.id
    }

    return true
  }

  public async view(acl: AclService, task: Task) {
    return (
      acl.has('tasks', 'read') || task.creatorId === acl.user.id || task.ownerId === acl.user.id
    )
  }

  public async create(acl: AclService, roomId: number) {
    return (
      acl.has('tasks', 'create') ||
      (await Room.query()
        .where('id', roomId)
        .where((query) => {
          query.where('creatorId', acl.user.id)
        })
        .first()) !== null
    )
  }

  public async update(acl: AclService, task: Task) {
    return acl.has('tasks', 'update') || task.creatorId === acl.user.id
  }

  public async delete(acl: AclService, task: Task) {
    return acl.has('tasks', 'delete') || task.creatorId === acl.user.id
  }
}
