import Config from '@ioc:Adonis/Core/Config'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  HasMany,
  HasOne,
  ManyToMany,
  beforeSave,
  column,
  hasMany,
  hasOne,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { AttachmentConfig } from 'Config/attachment'
import { DateTime } from 'luxon'
import Message from './Message'
import UserProfile from './UserProfile'
import Room from './Room'
import Task from './Task'
import BaseModel from './BaseModel'

export const AvatarConfig: AttachmentConfig = Config.get('attachment.user')

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public roleId: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public username: string

  @column()
  public firstName: string | null

  @column()
  public lastName: string | null

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => UserProfile, {
    foreignKey: 'userId',
  })
  public profile: HasOne<typeof UserProfile>

  @hasMany(() => Room, {
    localKey: 'id',
    foreignKey: 'creatorId',
  })
  public room: HasMany<typeof Room>

  @manyToMany(() => Room, {
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'room_id',
    pivotTable: 'room_users',
    pivotTimestamps: {
      createdAt: 'createdAt',
      updatedAt: false,
    },
  })
  public rooms: ManyToMany<typeof Room>

  @hasMany(() => Message)
  public messages: HasMany<typeof Message>

  @hasMany(() => Task)
  public tasks: HasMany<typeof Task>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
