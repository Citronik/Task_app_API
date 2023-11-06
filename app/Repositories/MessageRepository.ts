import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Message from 'App/Models/Message'
import { IndexMessageValidatorProps } from 'App/Validators/Message/IndexMessageValidator'

type Query = ModelQueryBuilderContract<typeof Message>

class MessageRepository {
  private filterQuery(query: Query, options: IndexMessageValidatorProps) {
    options.roomId && query.where('roomId', options.roomId)
    options.q && query.whereILike('name', `%${options.q}%`)
  }

  public get(options: IndexMessageValidatorProps) {
    const query = Message.query()

    this.filterQuery(query, options)

    query.orderBy(options.sortBy ?? 'id', options.sortOrder ?? 'desc')

    return query
  }

  public getById(id: number) {
    return Message.query().where('id', id)
  }
}

export default new MessageRepository()
