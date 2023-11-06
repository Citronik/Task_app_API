import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string.optional({ trim: true }, [
      rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
    ]),
    password: schema.string.optional({ trim: true }, [rules.minLength(8)]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
    ]),
    roleId: schema.number.optional([
      rules.exists({
        table: 'roles',
        column: 'id',
      }),
    ]),
  })
}

let validator: CreateUserValidator
export type CreateUserValidatorProps = typeof validator.schema.props
