import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasOne, HasOne, HasMany, hasMany, ManyToMany, manyToMany,
  afterCreate } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'
import Room from './Room'
import Participant from './Participant'
import Message from './Message'
import Task from './Task'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public username: string

  @column({ serializeAs: 'firstName' })
  public first_name: string | null

  @column({ serializeAs: 'lastName' })
  public last_name: string | null

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Profile, {
    foreignKey: 'user_id',
  })
  public profile: HasOne<typeof Profile>

  @hasMany(() => Room, {
    localKey: 'id',
    foreignKey: 'creator_id',
  })
  public room: HasMany<typeof Room>

  @manyToMany(() => Room, {
    pivotForeignKey: 'participant_id',
    pivotRelatedForeignKey: 'room_id',
    pivotTable: 'participants',
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
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
