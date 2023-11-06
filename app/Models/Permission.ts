import { column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import BaseModel from './BaseModel'

export const PermissionTypes = ['read', 'create', 'update', 'delete'] as const
export type PermissionType = (typeof PermissionTypes)[number]

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
