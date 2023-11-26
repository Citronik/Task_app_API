import { PermissionType } from '../Models/Permission'
import Role from '../Models/Role'
import User from '../Models/User'
import { ForbiddenException } from 'App/Exceptions/User'
import ConstantsService from './ConstantsService'

export class AclService {
  public role: Role

  constructor(public readonly user: User) {
    this.role = ConstantsService.roles.find((item) => item.id === user.roleId)!
  }

  public has(permissionName: string, type: PermissionType) {
    if (this.role.isAdmin) {
      return true
    }

    const permission = ConstantsService.permissions.find((item) => item.uid === permissionName)

    if (!permission) {
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
