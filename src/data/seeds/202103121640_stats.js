const { tables } = require('..');

module.exports = {
    seed: async (knex) => {
        await knex(tables.stats).delete();

        await knex(tables.stats).insert([
            {
                gebruikersID: '1706481d-ae5a-4bcf-9ee3-20e71746e19c',
                gewoonteIDMeestVoltooid: '360e6bbd-5ed4-466e-97f1-3ee356c277b7',
                meesteGeldOoit: 124,
                meestWinstStockmarketOoit: 26,
                geld: 56,
            },
            {
                gebruikersID: '2529923f-1c94-4f0f-84d1-1444dc9c73e4',
                gewoonteIDMeestVoltooid: '4edfc4a4-9f15-4952-b657-69c55330a49e',
                meesteGeldOoit: 0,
                meestWinstStockmarketOoit: 0,
                geld: 0,
            },
        ]);
    },
};