const { tables } = require('..');

module.exports = {
    seed: async (knex) => {
        await knex(tables.gewoontes).delete();

        await knex(tables.gewoontes).insert([
            {
                gewoonteID: '360e6bbd-5ed4-466e-97f1-3ee356c277b7',
                gebruikersID: '1706481d-ae5a-4bcf-9ee3-20e71746e19c',
                naam: 'Studeren',
                startDatum: '2021-12-01',
                geldBijVoltooiing: 15,
                aantalKeerVoltooid: 0,
                laatsteKeerVoltooid: '2021-12-01',
                soortHerhaling: 'Dagelijks',
            },
            {
                gewoonteID: '8a307ca2-b393-4847-80b6-fa9f22e6e7a9',
                gebruikersID: '1706481d-ae5a-4bcf-9ee3-20e71746e19c',
                naam: 'Lopen',
                startDatum: '2021-11-08',
                geldBijVoltooiing: 40,
                aantalKeerVoltooid: 2,
                laatsteKeerVoltooid: '2021-11-21',
                soortHerhaling: 'Wekelijks',
            },
            {
                gewoonteID: '4edfc4a4-9f15-4952-b657-69c55330a49e',
                gebruikersID: '2529923f-1c94-4f0f-84d1-1444dc9c73e4',
                naam: 'Boodschappen doen',
                startDatum: '2021-11-26',
                geldBijVoltooiing: 80,
                aantalKeerVoltooid: 0,
                laatsteKeerVoltooid: '2021-11-26',
                soortHerhaling: 'Maandelijks'
            },
        ]);
    },
};