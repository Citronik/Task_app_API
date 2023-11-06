import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Task from 'App/Models/Task'
import { IndexTaskValidatorProps } from 'App/Validators/Task/IndexTaskValidator'

type Query = ModelQueryBuilderContract<typeof Task>

class TaskRepository {
  private filterQuery(query: Query, options: IndexTaskValidatorProps) {
    options.userId &&
      query.where((query) => {
        query.where('creatorId', options.userId!).orWhere('ownerId', options.userId!)
      })

    options.q && query.whereILike('name', `%${options.q}%`)
  }

  public get(options: IndexTaskValidatorProps) {
    const query = Task.query()

    this.filterQuery(query, options)

    query.orderBy(options.sortBy ?? 'id', options.sortOrder ?? 'desc')

    return query
  }

  public getById(id: number) {
    return Task.query().where('id', id)
  }
}

export default new TaskRepository()
