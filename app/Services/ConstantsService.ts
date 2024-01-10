import Logger from '@ioc:Adonis/Core/Logger'
import Permission from 'App/Models/Permission'
import Role from 'App/Models/Role'
import constantsConfig from 'Config/constants'

class ConstantsService {
  private updaterTimer: NodeJS.Timeout | null = null
  public roles: Role[] = []
  public permissions: Permission[] = []

  public async load() {
    const [roles, permissions] = await Promise.all([
      Role.query().preload('permissions'),
      Permission.all(),
    ])

    this.roles = roles
    this.permissions = permissions

    Logger.info('[ConstantsService] loaded %s roles', this.roles.length)
    Logger.info('[ConstantsService] loaded %s permissions', this.permissions.length)
  }

  public updaterSchedule() {
    this.updaterTimer =
      this.updaterTimer ||
      setTimeout(() => {
        this.updaterTimer = null

        this.load()
        this.updaterSchedule()
      }, constantsConfig.updaterInterval)
    Logger.debug('[ConstantsService] updater scheduled to : %s', this.updaterTimer)
  }

  public updaterStop() {
    if (this.updaterTimer) {
      clearTimeout(this.updaterTimer)

      this.updaterTimer = null
    }
    Logger.debug('[ConstantsService] updater stopped')
  }

  public getRole(id: number) {
    Logger.debug('[ConstantsService] getRole: %s', id)
    return this.roles.find((item) => item.id === id)
  }

  public getDefaultRole() {
    Logger.debug('[ConstantsService] getDefaultRole')
    return this.roles.find((item) => item.isDefault)!
  }

  public getPermission(id: number) {
    Logger.debug('[ConstantsService] getPermission: %s', id)
    return this.permissions.find((item) => item.id === id)
  }
}

export default new ConstantsService()
