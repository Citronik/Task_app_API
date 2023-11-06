import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import { column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import BaseModel from './BaseModel'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number | null

  @attachment()
  public file: AttachmentContract

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
