import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import Logger from '@ioc:Adonis/Core/Logger'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
    try {
      const constantsService = this.app.container.use('App/Services/ConstantsService').default
      await constantsService.load()

      constantsService.updaterSchedule()
    } catch (err) {
      if (this.app.environment !== 'console') {
        // TODO: log error?
        Logger.error('[AppProvider]', err)
      }
    }
  }

  public async shutdown() {
    // Cleanup, since app is going down
    const constantsService = this.app.container.use('App/Services/ConstantsService').default
    constantsService.updaterStop()
  }
}
