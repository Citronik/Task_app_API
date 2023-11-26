import { ColumnOptions, type DecoratorFn, type LucidModel } from '@ioc:Adonis/Lucid/Orm'

export function json(options?: Partial<ColumnOptions>): DecoratorFn {
  return function decorateAsJson(target, property) {
    const Model = target.constructor as LucidModel

    Model.boot()
    Model.$addColumn(property, {
      prepare: (value: string | null) =>
        typeof value !== 'string' && value !== null ? JSON.stringify(value) : value,
      ...options,
    })
  }
}
