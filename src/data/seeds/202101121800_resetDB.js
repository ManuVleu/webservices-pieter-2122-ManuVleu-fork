const { tables } = require('..');

module.exports = {
    seed: async (knex) => {
        await knex(tables.gebruikers).delete();
        await knex(tables.gewoontes).delete();
        await knex(tables.taken).delete();
        await knex(tables.stats).delete();
        await knex(tables.stockmarket).delete();
    },
};