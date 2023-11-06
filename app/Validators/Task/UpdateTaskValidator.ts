import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TaskStatuses } from 'App/Models/Task'

export default class UpdateTaskValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [rules.maxLength(120)]),
    description: schema.string({}, []),
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

let validator: UpdateTaskValidator
export type UpdateTaskValidatorProps = typeof validator.schema.props
