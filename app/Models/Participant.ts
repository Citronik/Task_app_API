import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Room from './Room'

export default class Participant extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public room_id: number

  @column()
  public participant_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

}
