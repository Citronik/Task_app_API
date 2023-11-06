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

    Logger.info('ConstantsService: constants loaded')
  }

  public updaterSchedule() {
    this.updaterTimer =
      this.updaterTimer ||
      setTimeout(() => {
        this.updaterTimer = null

        this.load()
        this.updaterSchedule()
      }, constantsConfig.updaterInterval)
  }

  public updaterStop() {
    if (this.updaterTimer) {
      clearTimeout(this.updaterTimer)

      this.updaterTimer = null
    }
  }

  public getRole(id: number) {
    return this.roles.find((item) => item.id === id)
  }

  public getDefaultRole() {
    return this.roles.find((item) => item.isDefault)!
  }

  public getPermission(id: number) {
    return this.permissions.find((item) => item.id === id)
  }
}

export default new ConstantsService()
