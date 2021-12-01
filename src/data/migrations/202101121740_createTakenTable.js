const { tables } = require('..');

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable(tables.taken, (table) => {
            table.uuid('taakID').primary();

            table.uuid('gebruikersID').notNullable();

            table.string('naam',255).notNullable();

            table.date('startDatum').notNullable();

            table.integer('puntenBijVoltooiing');

            table.date('eindDatum').notNullable();

            table.foreign('gebruikersID','fk_taak_gebruiker').references(`${tables.gebruikers}.id`).onDelete('CASCADE');
        });
    },
    down: (knex) => {
        return knex.schema.dropTableIfExists(tables.taken);
    },
};