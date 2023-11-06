import { Exception } from '@poppinss/utils'

export class ForbiddenException extends Exception {
  constructor() {
    super('You do not have access to perform this action.', 403, 'E_USERS_FORBIDDEN')
  }
}

export class InvalidCredentialsException extends Exception {
  constructor() {
    super('These credentials do not match any user.', 400, 'E_USER_INVALID_CREDENTIALS')
  }
}
