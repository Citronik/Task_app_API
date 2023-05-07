import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

import {
  attachment,
  AttachmentContract,
} from '@ioc:Adonis/Addons/AttachmentLite'

export default class Upload extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @attachment({ folder: 'avatars' })
  public file: AttachmentContract

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
