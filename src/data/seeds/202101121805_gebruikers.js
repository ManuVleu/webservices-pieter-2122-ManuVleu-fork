const { tables } = require('..');

module.exports = {
    seed: async (knex) => {
        await knex(tables.gebruikers).delete();

        await knex(tables.gebruikers).insert([
            {
                id: '1706481d-ae5a-4bcf-9ee3-20e71746e19c',
                naam: 'admin',
                wachtwoord: '123',
            },
            {
                id: '2529923f-1c94-4f0f-84d1-1444dc9c73e4',
                naam: 'Manu',
                wachtwoord: '123',
            },
        ]);
    },
};