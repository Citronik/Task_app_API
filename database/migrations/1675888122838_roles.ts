import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('uid', 64).notNullable().unique()
      table.string('name', 128).notNullable()
      table.text('description').nullable()

      table.boolean('is_admin').notNullable().defaultTo(false).index()
      table.boolean('is_default').notNullable().defaultTo(false).index()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
