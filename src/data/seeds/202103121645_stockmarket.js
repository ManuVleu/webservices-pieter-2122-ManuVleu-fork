const { tables } = require('..');

module.exports = {
    seed: async (knex) => {
        await knex(tables.stockmarket).delete();

        await knex(tables.stockmarket).insert([
            {
                gebruikersID: '1706481d-ae5a-4bcf-9ee3-20e71746e19c',
                geldBedrijfA: 0,
                geldBedrijfB: 14,
                geldBedrijfC: 0,
            },
            {
                gebruikersID: '2529923f-1c94-4f0f-84d1-1444dc9c73e4',
                geldBedrijfA: 0,
                geldBedrijfB: 0,
                geldBedrijfC: 0,
            },
        ]);
    },
};