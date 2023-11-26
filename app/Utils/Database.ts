import { managedTransaction } from '@adonisjs/lucid/build/src/utils'
import {
  HasManyClientContract,
  HasManyRelationContract,
  LucidModel,
  LucidRow,
} from '@ioc:Adonis/Lucid/Orm'

export function syncMany<T extends LucidModel>(
  related: HasManyClientContract<HasManyRelationContract<LucidModel, T>, T>,
  payload: any[],
  predicate: any,
  lookupIds: boolean = false
) {
  const relatedModel = related.relation.relatedModel()

  const client = relatedModel.$adapter.modelConstructorClient(relatedModel)

  // parent is defined, but private
  const parent = (related as any).parent as LucidRow

  return managedTransaction(parent.$trx || client, async (trx) => {
    parent.$trx = trx
    await parent.save()

    payload.forEach((row) => {
      related.relation.hydrateForPersistance(parent, row)
    })

    predicate = Array.isArray(predicate) ? predicate : predicate ? [predicate] : []

    const relatedModel = related.relation.relatedModel()

    const query = relatedModel
      .query({ client: trx })
      .forUpdate()
      .where(related.relation.foreignKey, parent.$primaryKeyValue!)

    if (lookupIds && payload.length) {
      query.orWhereIn(
        relatedModel.primaryKey,
        payload.map((rowObject) => rowObject[relatedModel.primaryKey])
      )
    }

    const existingRows = await query

    const rows = payload.map((rowObject: any) => {
      const existingRow = existingRows.find((one: any) => {
        /* eslint-disable-next-line eqeqeq */
        return predicate.every((key) => one[key] == rowObject[key])
      })

      /**
       * Return the row found from the select call
       */
      if (existingRow) {
        existingRow.merge(rowObject)
        return existingRow
      }

      const row = new relatedModel() as InstanceType<T>
      delete rowObject[relatedModel.primaryKey]
      row.fill(rowObject)

      row.$setOptionsAndTrx({
        client: trx,
      })

      return row
    })

    for (let row of rows) {
      await row.save()
    }

    const deleted = existingRows.filter((row) => !rows.includes(row))

    if (deleted.length) {
      await relatedModel
        .query({ client: trx })
        .whereIn(
          relatedModel.primaryKey,
          deleted.map((row) => row.$attributes[relatedModel.primaryKey])
        )
        .delete()
    }

    parent.$setRelated(related.relation.relationName, rows)

    return {
      rows,
      deleted,
    }
  })
}
