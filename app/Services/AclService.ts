import { PermissionType } from '../Models/Permission'
import Role from '../Models/Role'
import User from '../Models/User'
import { ForbiddenException } from 'App/Exceptions/User'
import ConstantsService from './ConstantsService'
//import { logger } from 'Config/app'
import Logger from '@ioc:Adonis/Core/Logger'

export class AclService {
  public role: Role

  constructor(public readonly user: User) {
    this.role = ConstantsService.roles.find((item) => item.id === user.roleId)!
    Logger.debug('[AclService] initiated')
  }

  public has(permissionName: string, type: PermissionType) {
    if (this.role.isAdmin) {
      Logger.debug('[AclService] User has admin rights')
      return true
    }

    const permission = ConstantsService.permissions.find((item) => item.uid === permissionName)

    if (!permission) {
      Logger.debug('[AclService] Permission not %s found', permissionName)
      return false
    }

    const access = this.role.permissions.find((item) => item.permissionId === permission.id)

    if (!access) {
      return false
    }

    return access.actions.includes(type)
  }

  public authorize(permissionName: string, type: PermissionType) {
    if (!this.has(permissionName, type)) {
      throw new ForbiddenException()
    }

    return true
  }
}
