import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'rooms'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('creator_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('room_name', 100).notNullable()
      table.text('room_table').notNullable()
      table.integer('photo_id').unsigned().nullable().references('id').inTable('uploads').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
