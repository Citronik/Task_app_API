import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Room from './Room'
import User from './User'

export default class Message extends BaseModel {
  public static table = 'room_messages'
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public room_id: number

  @column()
  public message: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Room, {
    foreignKey: 'room_id',
    localKey: 'id',
  })
  public room: BelongsTo<typeof Room>

  @belongsTo(() => User, {
    foreignKey: 'user_id',
    localKey: 'id',
  })
  public author: BelongsTo<typeof User>
}
