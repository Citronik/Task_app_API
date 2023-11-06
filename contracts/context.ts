import { AclService } from 'App/Services/AclService'

declare module '@ioc:Adonis/Core/HttpContext' {
  interface HttpContextContract {
    acl: AclService | undefined
  }
}
