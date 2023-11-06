import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'

export default class extends BaseSeeder {
  public async run() {
    const data: Partial<Permission>[] = [
      { uid: 'users', name: 'Users' },
      { uid: 'rooms', name: 'Rooms' },
      { uid: 'messages', name: 'Messages' },
      { uid: 'tasks', name: 'Tasks' },
    ]

    await Permission.updateOrCreateMany('uid', data)
  }
}
