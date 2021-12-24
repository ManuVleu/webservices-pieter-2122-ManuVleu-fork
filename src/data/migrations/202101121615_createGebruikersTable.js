const { tables } = require('..');

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable(tables.gebruikers,(table) => {
            table.uuid('id').primary();

            table.string('naam',255).notNullable();
        });
    },
    down: (knex) => {
        return knex.schema.dropTableIfExists(tables.gebruikers);
    },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
};