import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateTaskValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    task_name: schema.string({},
      [ rules.maxLength(120)]),
    task_description: schema.string({},
      []),
    status: schema.enumSet([
      'ToDo',
      'Execution',
      'Done',
    ] as const),
    deadline: schema.date.optional({
      format: 'sql',
    }),
  })

  public messages: CustomMessages = {
    required: 'The {{ field }} is required to create a new task',
    'task_name.maxLength': 'Name of the task is too long',
    'enumSet': 'The values must be one of {{ options.choices }}',
    'deadline.date': 'The value must be a date',
  }
}
