import Logger from '@ioc:Adonis/Core/Logger'
import Room from 'App/Models/Room'
import Task from 'App/Models/Task'
import CreateTask from 'App/Validators/Task/CreateTaskValidator'
import UpdateTask from 'App/Validators/Task/UpdateTaskValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TasksController {
  public async index({ acl, params, bouncer }: HttpContextContract) {
    Logger.info('Get a ' + params.id + ' Room Task')
    const room = await Room.findOrFail(params.id)
    await bouncer.with('TaskPolicy').forUser(acl).authorize('viewList', room)
    await room.load('tasks')
    return room.tasks
  }

  public async show({ acl, params, bouncer }: HttpContextContract) {
    Logger.info('Get a ' + params.id + ' Room Message: ' + params.message_id)
    const room = await Room.findOrFail(params.id)
    await bouncer.with('TaskPolicy').forUser(acl).authorize('view', task)
    await room.load('messages')
    return room.messages.filter((message) => {
      if (message.id === params.message_id) {
        return message
      }
    })
  }

  public async store({ acl, auth, request, params, bouncer }: HttpContextContract) {
    Logger.info('Get a ' + params.id + ' Room Message: ')
    const room = await Room.findOrFail(params.id)
    //const user = await User.findOrFail(auth.user.id);
    await bouncer.with('TaskPolicy').forUser(acl).authorize('create', room)
    const payload = await request.validate(CreateTask)
    const task = new Task()
    task.merge(payload)
    task.creatorId = auth.user!.id
    await task.related('room').associate(room)
    return task
  }

  public async update({ acl, auth, request, params, bouncer }: HttpContextContract) {
    Logger.info('Update a ' + params.id + ' Room Message: ')
    const room = await Room.findOrFail(params.id)
    await bouncer.with('TaskPolicy').forUser(acl).authorize('update', task)
    const payload = await request.validate(UpdateTask)
    const task = await Task.query()
      .where('room_id', params.id)
      .where('id', params.task_id)
      .where('creator_id', auth.user!.id)
      .firstOrFail()
    task.merge(payload)
    return task
  }

  public async destroy({ acl, params, auth, bouncer }: HttpContextContract) {
    const room = await Room.findOrFail(params.id)
    await bouncer.with('TaskPolicy').forUser(acl).authorize('delete', room)
    const task = await Task.query()
      .where('room_id', params.id)
      .where('id', params.task_id)
      .where('creator_id', auth.user!.id)
      .firstOrFail()
    await task.delete()
    return true
  }
}
