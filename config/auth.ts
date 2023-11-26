import type { AuthConfig } from '@ioc:Adonis/Addons/Auth'

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
    api: {
      driver: 'oat',
      provider: {
        driver: 'lucid',
        identifierKey: 'id',
        uids: ['username', 'email'],
        model: () => import('App/Models/User'),
      },
      tokenProvider: {
        type: 'api',
        driver: 'database',
        table: 'api_tokens',
        foreignKey: 'user_id',
      },
    },
  },
}

export default authConfig
