import App from '@ioc:Adonis/Core/Application'
import { type HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, type CustomMessages, Rule } from '@ioc:Adonis/Core/Validator'

type IndexSchemaOptions = {
  sortBy?: string[]
  searchRulesArray?: Rule[]
}

export const defaultRules = {
  uid: [rules.maxLength(64), rules.regex(/^[a-z0-9_-]+$/)],
  email: [
    rules.maxLength(128),
    rules.email({}),
    rules.normalizeEmail({
      allLowercase: true,
      gmailRemoveDots: false,
      gmailRemoveSubaddress: App.inProduction,
    }),
  ],
  password: [rules.maxLength(64)],
  currentPassword: [rules.maxLength(64)], // should not require any specific characters
  search: [rules.alphaNum({ allow: ['space'] })],
}

export const defaultMessages: CustomMessages = {
  required: 'Field is required.',
  requiredWhen: 'Field is required.',
  maxLength: 'Maximum allowed length is {{ options.maxLength }} characters.',
  unique: 'This {{ field }} is already used.',
}

export default abstract class BaseValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({})

  public bail = false

  public cacheKey = this.ctx.routeKey

  public messages = defaultMessages

  public defaultRules = defaultRules

  public searchSchema(rulesArray?: Rule[]) {
    return {
      q: schema.string.optional(
        {
          trim: true,
        },
        rulesArray
          ? rulesArray.concat(this.defaultRules.search)
          : (this.defaultRules.search as Rule[])
      ),
    }
  }

  public defaultIndexSchema(options?: IndexSchemaOptions) {
    return {
      page: schema.number.optional([rules.unsigned()]),
      perPage: schema.number.optional([rules.range(1, 50)]),

      sortBy: schema.enum.optional(options?.sortBy ?? []),
      sortOrder: schema.enum.optional(['asc', 'desc'] as const),

      ...this.searchSchema(options?.searchRulesArray),
    }
  }

  protected requiredIf(value: boolean) {
    return value ? [rules.required()] : []
  }
}
