import type { AuthConfig } from '@ioc:Adonis/Addons/Auth'

/*
|--------------------------------------------------------------------------
| Authentication Mapping
|--------------------------------------------------------------------------
|
| List of available authentication mapping. You must first define them
| inside the `contracts/auth.ts` file before mentioning them here.
|
*/
const authConfig: AuthConfig = {
  guard: 'web',
  guards: {
    web: {
      driver: 'session',
      provider: {

        driver: 'lucid',

        identifierKey: 'id',

        uids: ['username', 'email'],

        model: () => import('App/Models/User'),
      },
    },
  },
}

export default authConfig
