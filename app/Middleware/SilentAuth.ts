import { GuardsList } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import authConfig from 'Config/auth'

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class SilentAuthMiddleware {
  /**
   * Handle request
   */
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    /**
     * Check if user is logged-in or not. If yes, then `ctx.auth.user` will be
     * set to the instance of the currently logged in user.
     */
    const guards = Object.keys(authConfig.guards) as (keyof GuardsList)[]
    for (let guard of guards) {
      const check = await auth.use(guard).check()
      if (check) {
        auth.defaultGuard = guard
        break
      }
    }

    await next()
  }
}
