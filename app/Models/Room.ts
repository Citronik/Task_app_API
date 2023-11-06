import Config from '@ioc:Adonis/Core/Config'
import {
  BelongsTo,
  belongsTo,
  column,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import { AttachmentConfig } from 'Config/attachment'
import { DateTime } from 'luxon'
import BaseModel from './BaseModel'
import File from './File'
import Message from './Message'
import Task from './Task'
import User from './User'

export const PhotoConfig: AttachmentConfig = Config.get('attachment.room')

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public creatorId: number

  @column()
  public name: string

  @column()
  public table: string

  @column()
  public photoId: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public creator: BelongsTo<typeof User>

  @belongsTo(() => File, {
    foreignKey: 'photoId',
  })
  public photo: BelongsTo<typeof File>

  @manyToMany(() => User, {
    pivotTable: 'room_users',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'room_id',
  })
  public participants: ManyToMany<typeof User>

  @hasMany(() => Message)
  public messages: HasMany<typeof Message>

  @hasMany(() => Task)
  public tasks: HasMany<typeof Task>
}
