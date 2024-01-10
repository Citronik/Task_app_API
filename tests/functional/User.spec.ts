import { test } from '@japa/runner'

test('User register', async ({ client }) => {
  const testUser = {
    username: 'testUsername',
    password: 'testPassword',
    email: 'testmail@test.ts',
    roleId: 1,
  }
  const response = await client.post('/api/users/register')

  response.assertStatus(200)
  response.assertBodyContains(testUser)
})
