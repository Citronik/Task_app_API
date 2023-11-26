import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string({ trim: true }, [
      rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
    ]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
    ]),
    password: schema.string({}, [rules.required(), rules.minLength(8)]),
    firstName: schema.string.nullableAndOptional(),
    lastName: schema.string.nullableAndOptional(),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'required': 'The {{ field }} is required to create a new account',
    'username.unique': 'Username not available',
    'email.unique': 'Email already in use',
    'password.minLength(8)': 'Password have to be at least 8 characters',
  }
}

let validator: RegisterUserValidator
export type RegisterUserValidatorProps = typeof validator.schema.props
