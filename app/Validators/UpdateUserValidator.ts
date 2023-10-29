import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string.optional({ trim: true },
      [ rules.unique({ table: 'users', column: 'username', caseInsensitive: true })]),
    password: schema.string.optional({ trim: true }, [ rules.minLength(8)]),
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
    required: 'The {{ field }} is required to create a new account',
    'username.unique': 'Username already in use',
    'password.minLength(8)': 'Password have to be at least 8 characters',
  }
}
