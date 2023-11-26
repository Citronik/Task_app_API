import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Room from 'App/Models/Room'
import { IndexRoomValidatorProps } from 'App/Validators/Room/IndexRoomValidator'

type Query = ModelQueryBuilderContract<typeof Room>

class RoomRepository {
  private filterQuery(query: Query, options: IndexRoomValidatorProps) {
    options.userId &&
      query.where((query) => {
        query
          .where('creatorId', options.userId!)
          .orWhereHas('participants', (query) => query.where('room_users.user_id', options.userId!))
      })
    options.q && query.whereILike('name', `%${options.q}%`)
  }

  public get(options: IndexRoomValidatorProps) {
    const query = Room.query().preload('photo')

    this.filterQuery(query, options)

    query.orderBy(options.sortBy ?? 'id', options.sortOrder ?? 'desc')

    return query
  }

  public getById(id: number) {
    return Room.query().where('id', id)
  }
}

export default new RoomRepository()
