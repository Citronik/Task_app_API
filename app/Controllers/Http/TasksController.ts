// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Room from 'App/Models/Room'
import Task from 'App/Models/Task'
import CreateTask from 'App/Validators/Task/CreateTaskValidator'
import UpdateTask from 'App/Validators/Task/UpdateTaskValidator'

export default class TasksController {
  public async getRoomTasks ({ params, bouncer }) {
    console.log('Get a '+ params.id +' Room Task')
    const room = await Room.findOrFail(params.id)
    await bouncer.with('RoomPolicy').authorize('isParticipants', room)
    await room.load('tasks')
    return room.tasks
  }

  public async getRoomTask ({ params, bouncer }) {
    console.log('Get a '+ params.id +' Room Message: ' + params.msg_id)
    const room = await Room.findOrFail(params.id)
    await bouncer.with('RoomPolicy').authorize('isParticipants', room)
    await room.load('messages')
    return room.messages.filter((message) => {
      if (message.id === params.msg_id) {
        return message
      }
    })
  }

  public async create ({ auth, request, params, bouncer }) {
    console.log('Get a '+ params.id +' Room Message: ')
    const room = await Room.findOrFail(params.id)
    //const user = await User.findOrFail(auth.user.id);
    await bouncer.with('RoomPolicy').authorize('isParticipants', room)
    const payload = await request.validate(CreateTask)
    const task = new Task()
    task.merge(payload)
    task.creator_id = auth.user.id
    await task.related('room').associate(room)
    return task
  }

  public async destroy ({ params, auth, bouncer }) {
    const room = await Room.findOrFail(params.id)
    await bouncer.with('RoomPolicy').authorize('isParticipants', room)
    const task = await Task.query()
      .where('room_id', params.id)
      .where('id', params.task_id)
      .where('creator_id', auth.user.id)
      .firstOrFail()
    await task.delete()
    return true
  }

  public async update ({ auth, request, params, bouncer }) {
    console.log('Update a '+ params.id +' Room Message: ')
    const room = await Room.findOrFail(params.id)
    await bouncer.with('RoomPolicy').authorize('isParticipants', room)
    await bouncer.with('RoomPolicy').authorize('isCreatorOfTask', auth.user)
    const payload = await request.validate(UpdateTask)
    const task = await Task.query()
      .where('room_id', params.id)
      .where('id', params.task_id)
      .where('creator_id', auth.user.id)
      .firstOrFail()
    task.merge(payload)
    return task
  }
}
