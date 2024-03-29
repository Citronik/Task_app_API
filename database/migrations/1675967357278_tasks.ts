import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('room_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('rooms')
        .onDelete('CASCADE')

      table
        .integer('creator_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.integer('owner_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.string('name', 120).notNullable()
      table.text('description').notNullable()
      table.string('status', 32).notNullable()
      table.dateTime('deadline').nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
