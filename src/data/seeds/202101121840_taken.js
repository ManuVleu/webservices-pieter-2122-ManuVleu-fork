const { tables } = require('..');

module.exports = {
    seed: async (knex) => {
        await knex(tables.taken).delete();

        await knex(tables.taken).insert([
            {
                taakID: 'b57f1ee1-6d48-4e9b-b7ca-c8bc7de25429',
                gebruikersID: '1706481d-ae5a-4bcf-9ee3-20e71746e19c',
                naam: 'Website afwerken',
                startDatum: '2021-12-01',
                geldBijVoltooiing: 120,
                eindDatum: '2021-02-27',
            },
            {
                taakID: 'a97d329b-87b0-4bf4-80d7-7e55b25e13c4',
                gebruikersID: '2529923f-1c94-4f0f-84d1-1444dc9c73e4',
                naam: 'Lamp vervangen',
                startDatum: '2021-11-10',
                geldBijVoltooiing: 80,
                eindDatum: '2021-03-15',
            },
        ]);
    },
};