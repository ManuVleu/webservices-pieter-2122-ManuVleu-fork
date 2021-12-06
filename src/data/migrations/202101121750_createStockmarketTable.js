const { tables } = require('..');

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable(tables.stockmarket, (table) => {
            table.uuid('gebruikersID').primary();

            table.integer('geldBedrijfA');

            table.integer('geldBedrijfB');

            table.integer('geldBedrijfC');

            table.foreign('gebruikersID','fk_stockmarket_gebruiker').references(`${tables.gebruikers}.id`).onDelete('CASCADE');
        });
    },
    down: (knex) => {
        return knex.schema.dropTableIfExists(tables.stats);
    },
};