import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import { AclService } from 'App/Services/AclService'

export default class UserPolicy extends BasePolicy {
  public async viewList(acl: AclService) {
    return acl.has('users', 'read')
  }

  public async view(acl: AclService, _user: User) {
    return acl.has('users', 'read')
  }

  public async update(acl: AclService, user: User) {
    return acl.has('users', 'update') || user.id === acl.user.id
  }

  public async delete(acl: AclService, _user: User) {
    return acl.has('users', 'delete')
  }
}
