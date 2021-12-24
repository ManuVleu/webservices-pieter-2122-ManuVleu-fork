const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.alterTable(tables.gebruikers, (table) => {
      table.string('wachtwoord')
        .notNullable();

      table.jsonb('roles')
        .notNullable();
    });
  },
  down: (knex) => {
    return knex.schema.alterTable(tables.gebruikers, (table) => {
      table.dropColumns( 'wachtwoord', 'roles');
    });
  },
};
