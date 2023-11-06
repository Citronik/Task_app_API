import Route from '@ioc:Adonis/Core/Route'

export function usersRoutes() {
  return Route.group(() => {
    Route.group(() => {
      Route.post('register', 'UsersController.register')
      Route.post('login', 'UsersController.login')

      Route.group(() => {
        Route.post('logout', 'UsersController.logout')
        Route.get('validate', 'UsersController.isLoggedIn')

        Route.get('me', 'UsersController.show').as('self.show')
        Route.patch('me', 'UsersController.update').as('self.update')
        Route.post('upload-avatar', 'UsersController.uploadAvatar')
      }).middleware('auth')
    }).prefix('users')

    Route.resource('users', 'UsersController')
      .only(['index', 'show', 'update'])
      .where('id', Route.matchers.number())
      .middleware({
        '*': ['auth'],
      })
  })
}
