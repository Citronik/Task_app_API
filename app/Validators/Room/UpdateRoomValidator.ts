import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateRoomValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({}, [rules.required(), rules.maxLength(100)]),
    table: schema.string.optional({}, [rules.required()]),
  })

  public messages: CustomMessages = {
    'required': 'The {{ field }} is required to create a new room',
    'name.maxLength(100)': 'Name of the room must not be longer than 100 chars',
  }
}

let validator: UpdateRoomValidator
export type UpdateRoomValidatorProps = typeof validator.schema.props
