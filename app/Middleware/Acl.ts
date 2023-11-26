import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AclService } from '../Services/AclService'

export default class Acl {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    if (ctx.auth.user) {
      ctx.acl = new AclService(ctx.auth.user)
    }

    await next()
  }
}
