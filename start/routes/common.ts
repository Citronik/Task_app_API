import Route from '@ioc:Adonis/Core/Route'

export function commonRoutes() {
  return Route.group(() => {
    Route.get('config', 'AppController.config')
    Route.get('health', 'AppController.health')
    Route.get('/', 'AppController.health')
  })
}
