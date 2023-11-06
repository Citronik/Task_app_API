import Route from '@ioc:Adonis/Core/Route'

export function roomsRoutes() {
  return Route.group(() => {
    Route.group(() => {
      Route.post('upload-photo', 'RoomsController.uploadPhoto').as('upload-photo')

      Route.group(() => {
        Route.resource('messages', 'MessagesController')
          .apiOnly()
          .except(['update'])
          .paramFor('messages', 'message_id')
          .where('message_id', Route.matchers.number())
          .as('messages')

        Route.resource('tasks', 'MessagesController')
          .apiOnly()
          .paramFor('tasks', 'task_id')
          .where('task_id', Route.matchers.number())
          .as('tasks')

        Route.resource('users', 'RoomUsersController')
          .apiOnly()
          .except(['update'])
          .paramFor('users', 'user_id')
          .where('user_id', Route.matchers.number())
          .as('users')
      }).prefix(':id')
    })
      .prefix('rooms')
      .as('rooms')

    Route.resource('rooms', 'RoomsController').apiOnly().where('id', Route.matchers.number())
  }).middleware('auth')
}
