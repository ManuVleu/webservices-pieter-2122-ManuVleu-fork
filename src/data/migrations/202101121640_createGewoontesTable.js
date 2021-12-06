const { tables } = require('..');

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable(tables.gewoontes, (table) => {
            table.uuid('gewoonteID').primary();

            table.uuid('gebruikersID').notNullable();

            table.string('naam',255).notNullable();

            table.date('startDatum').notNullable();

            table.integer('geldBijVoltooiing');

            table.integer('aantalKeerVoltooid');

            table.date('laatsteKeerVoltooid');

            table.string('soortHerhaling',100);

            table.foreign('gebruikersID','fk_gewoonte_gebruiker').references(`${tables.gebruikers}.id`).onDelete('CASCADE');
        });
    },
    down: (knex) => {
        return knex.schema.dropTableIfExists(tables.gewoontes);
    },
};