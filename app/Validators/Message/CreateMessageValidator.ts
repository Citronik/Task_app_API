import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateMessageValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    message: schema.string({}, [rules.required()]),
  })

  
  public messages: CustomMessages = {
    required: 'The {{ field }} is required to create a new room',
  }
}
