import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { syncMany } from 'App/Utils/Database'
import Permission, { PermissionType } from 'App/Models/Permission'
import Role from 'App/Models/Role'

interface RoleData {
  uid: string
  name: string
  isDefault?: boolean
  isAdmin?: boolean
  permissions: [string, PermissionType[]][]
}

export default class extends BaseSeeder {
  public async run() {
    const permissionsList = await Permission.all()

    const roles: RoleData[] = [
      {
        uid: 'user',
        name: 'User',
        isDefault: true,
        permissions: [
          ['users', ['read']],
          ['rooms', ['create']],
        ],
      },
      { uid: 'admin', name: 'Super Admin', isAdmin: true, permissions: [] },
      {
        uid: 'roomParticipant',
        name: 'Room Participant',
        permissions: [
          ['users', ['read']],
          ['rooms', ['read', 'create']],
          ['messages', ['update', 'read', 'create', 'delete']],
          ['tasks', ['update', 'read', 'create', 'delete']],
        ],
      },
      {
        uid: 'roomOwner',
        name: 'Room Admin',
        permissions: [
          ['users', ['read']],
          ['rooms', ['update', 'read', 'create', 'delete']],
          ['messages', ['update', 'read', 'create', 'delete']],
          ['tasks', ['update', 'read', 'create', 'delete']],
        ],
      },
    ]

    for (const roleData of roles) {
      const { permissions, ...properties } = roleData
      const role = await Role.updateOrCreate(
        {
          uid: properties.uid,
        },
        properties
      )

      const rolePermissions = permissions.map((item) => {
        const permission = permissionsList.find((permission) => permission.uid === item[0])

        return {
          permissionId: permission!.id,
          actions: JSON.stringify(item[1]),
        }
      })

      await syncMany(role.related('permissions'), rolePermissions, 'permissionId')
    }
  }
}
