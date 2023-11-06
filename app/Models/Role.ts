import { DateTime } from 'luxon'
import { HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import BaseModel from './BaseModel'
import RolePermission from './RolePermission'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public name: string

  @column()
  public description: string | null

  @column()
  public isAdmin: boolean

  @column()
  public isDefault: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => RolePermission)
  public permissions: HasMany<typeof RolePermission>
}
