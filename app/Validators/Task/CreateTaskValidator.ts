import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TaskStatuses } from 'App/Models/Task'

export default class CreateTaskValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [rules.required(), rules.maxLength(120)]),
    description: schema.string({}, [rules.required()]),
    status: schema.enum(TaskStatuses),
    deadline: schema.date.optional({
      format: 'sql',
    }),
  })

  public messages: CustomMessages = {
    'required': 'The {{ field }} is required to create a new task',
    'name.maxLength': 'Name of the task is too long',
    'enumSet': 'The values must be one of {{ options.choices }}',
    'deadline.date': 'The value must be a date',
  }
}

let validator: CreateTaskValidator
export type CreateTaskValidatorProps = typeof validator.schema.props
