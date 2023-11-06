import Route from '@ioc:Adonis/Core/Route'

export function filesRoutes() {
  return Route.group(() => {
    Route.get('files/:id', 'FilesController.show').where('id', Route.matchers.number())
  }).middleware('auth')
}
