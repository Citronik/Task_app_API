import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Room from './Room'
import User from './User'
import BaseModel from './BaseModel'

export const TaskStatuses = ['todo', 'execution', 'done'] as const
export type TaskStatus = (typeof TaskStatuses)[number]

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public roomId: number

  @column()
  public creatorId: number

  @column()
  public ownerId: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public status: TaskStatus

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Room)
  public room: BelongsTo<typeof Room>

  @belongsTo(() => User)
  public creator: BelongsTo<typeof User>

  @belongsTo(() => User)
  public owner: BelongsTo<typeof User>
}
