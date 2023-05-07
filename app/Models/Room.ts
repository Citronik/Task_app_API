import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, hasMany, HasMany, manyToMany,
  ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Message from './Message'
import Task from './Task'
import Upload from './Upload'

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public room_id: number

  @column()
  public creator_id: number

  @column()
  public room_name: string

  @column()
  public room_table: string

  @column()
  public photo_id: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'creator_id',
  })
  public creator: BelongsTo<typeof User>

  @belongsTo(() => Upload, {
    foreignKey: 'photo_id',
    localKey: 'id',
  })
  public photo: BelongsTo<typeof Upload>

  @manyToMany(() => User, {
    pivotTable: 'participants',
    pivotForeignKey: 'participant_id',
    pivotRelatedForeignKey: 'room_id',
  })
  public participants: ManyToMany<typeof User>

  @hasMany(() => Message, {
    serializeAs: 'room_messages',
    localKey: 'id',
    foreignKey: 'room_id',
  })
  public messages: HasMany<typeof Message>

  @hasMany(() => Task, {
    serializeAs: 'room_tasks',
    localKey: 'id',
    foreignKey: 'room_id',
  })
  public tasks: HasMany<typeof Task>
}
