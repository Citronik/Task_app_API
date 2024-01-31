import Route from '@ioc:Adonis/Core/Route'
import { commonRoutes } from './routes/common'
import { filesRoutes } from './routes/files'
import { usersRoutes } from './routes/users'
import { roomsRoutes } from './routes/rooms'

Route.group(() => {
  commonRoutes()
  usersRoutes()
  filesRoutes()
  roomsRoutes()
}).prefix('api')
