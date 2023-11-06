import { column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import BaseModel from './BaseModel'

export default class RoomUser extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public roomId: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
