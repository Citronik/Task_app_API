import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

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
        console.log(err)
      }
    }
  }

  public async shutdown() {
    // Cleanup, since app is going down
    const constantsService = this.app.container.use('App/Services/ConstantsService').default
    constantsService.updaterStop()
  }
}
