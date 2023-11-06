import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'role_permissions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('role_id')
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE')

      table
        .integer('permission_id')
        .unsigned()
        .notNullable()
        .index()
        .references('id')
        .inTable('permissions')
        .onDelete('CASCADE')

      table.jsonb('actions').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
