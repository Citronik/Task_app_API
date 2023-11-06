import { CherryPick, ModelObject, column } from '@ioc:Adonis/Lucid/Orm'
import ConstantsService from 'App/Services/ConstantsService'
import { json } from 'Database/decorators'
import BaseModel from './BaseModel'
import { PermissionType } from './Permission'

export default class RolePermission extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public roleId: number

  @column()
  public permissionId: number

  @json()
  public actions: PermissionType[]

  public serialize(_cherryPick?: CherryPick | undefined): ModelObject {
    return {
      permission: ConstantsService.getPermission(this.permissionId)?.uid,
      actions: this.actions,
    }
  }
}
