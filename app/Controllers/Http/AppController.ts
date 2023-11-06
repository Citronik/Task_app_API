import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import App from '@ioc:Adonis/Core/Application'
import ConstantsService from 'App/Services/ConstantsService'

export default class AppController {
  public async config({}: HttpContextContract) {
    return {
      roles: ConstantsService.roles,
      permissions: ConstantsService.permissions,
    }
  }

  public async health({ response }: HttpContextContract) {
    const report = await HealthCheck.getReport()

    const status = {
      ...report,
      name: App.appName,
      version: App.version,
    }

    return report.healthy ? response.ok(status) : response.badRequest(status)
  }
}
