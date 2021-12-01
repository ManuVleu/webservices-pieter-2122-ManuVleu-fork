const { tables } = require('..');

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable(tables.stats,(table) => {
            table.uuid('gebruikersID').primary();

            table.uuid('gewoonteIDMeestVoltooid');

            table.integer('meesteGeldOoit');

            table.integer('meestWinstStockmarketOoit');

            table.integer('geld');

            table.foreign('gebruikersID','fk_stats_gebruiker').references(`${tables.gebruikers}.id`).onDelete('CASCADE');
        });
    },
    down: (knex) => {
        return knex.schema.dropTableIfExists(tables.stats);
    },
}