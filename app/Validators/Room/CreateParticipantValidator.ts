import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateParticipantsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    participantsEmail: schema.array().members(schema.string({}, [rules.email(), rules.required()])),
  })

  public messages: CustomMessages = {
    'required': 'The {{ field }} is required to create a new room',
    'room_name.maxLength(100)': 'Name of the room must not be longer than 100 chars',
  }
}
