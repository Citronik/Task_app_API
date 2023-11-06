import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Room from './Room'
import User from './User'
import BaseModel from './BaseModel'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public roomId: number

  @column()
  public message: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Room)
  public room: BelongsTo<typeof Room>

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public author: BelongsTo<typeof User>
}
