import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string.optional({ trim: true }, [ rules.alphaNum(), rules.requiredIfNotExists('email'), rules.exists({ table: 'users', column: 'username', caseInsensitive: true })]),
    email: schema.string.optional({ trim: true }, [rules.email(), rules.requiredIfNotExists('username'), rules.exists({ table: 'users', column: 'email', caseInsensitive: true })]),
    password: schema.string({}, [rules.required(), rules.minLength(8)]),
  });

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
    required: 'The {{ field }} is required to login into the account',
    'password.minLength(8)': 'Password have to be at least 8 characters'
  }
}
