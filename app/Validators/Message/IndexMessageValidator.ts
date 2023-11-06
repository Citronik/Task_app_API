import { schema, rules } from '@ioc:Adonis/Core/Validator'
import BaseValidator from 'App/Validators/BaseValidator'

export default class IndexMessageValidator extends BaseValidator {
  public schema = schema.create({
    ...this.defaultIndexSchema({ sortBy: ['id', 'createdAt'] }),

    userId: schema.number.optional([rules.unsigned()]),
    roomId: schema.number.optional([rules.unsigned()]),
    q: schema.string.optional({ trim: true }),
  })
}

let validator: IndexMessageValidator
export type IndexMessageValidatorProps = typeof validator.schema.props
