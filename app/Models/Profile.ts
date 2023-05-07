import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Upload from './Upload'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public bio: string | null

  @column()
  public avatar_id: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: 'user_id',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Upload, {
    foreignKey: 'avatar_id',
    localKey: 'id',
  })
  public avatar: BelongsTo<typeof Upload>
}
