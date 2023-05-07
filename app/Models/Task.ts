import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import TaskStatus from 'App/Enums/TaskStatus'
import Room from './Room'
import User from './User'

export default class Task extends BaseModel {
  public static table = 'room_tasks'
  @column({ isPrimary: true })
  public id: number

  @column()
  public creator_id: number

  @column()
  public owner_id: number

  @column()
  public task_name: string

  @column()
  public task_description: string

  @column()
  public status: TaskStatus

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Room)
  public room: BelongsTo<typeof Room>

  @belongsTo(() => User)
  public author: BelongsTo<typeof User>
}
