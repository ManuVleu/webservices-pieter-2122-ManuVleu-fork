const { request } = require("http");
const { url } = require("inspector");
const { default: knex } = require("knex");
const { hasUncaughtExceptionCaptureCallback } = require("process");
const { tables } = require("../../src/data");

const data = {
    gewoontes: [{
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
        naam: '5km lopen',
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
    }],
    gebruikers: [
        {
            id: '1706481d-ae5a-4bcf-9ee3-20e71746e19c',
            naam: 'admin',
            wachtwoord: '123',
            roles: JSON.stringify([Role.ADMIN, Role.GEBRUIKER]),
        },
        {
            id: '2529923f-1c94-4f0f-84d1-1444dc9c73e4',
            naam: 'Manu',
            wachtwoord: '123',
            roles: JSON.stringify([Role.GEBRUIKER]),
        },
    ]
};

describe('gewoontes',() => {
    describe('GET /api/gewoontes',() => {
        it('should return 200 and list of gewoontes',async () => {
            const response = await request.get(`${url}?limit=2&offset=1`);
            expect(response.status).toBe(200);
            expect(response.body.limit).toBe(2);
            expect(response.body.offset).toBe(1);
		    expect(response.body.data.length).toBe(3);
            expect(response.body.data[0]).toEqual(
                data.gewoontes
            );
        });
    });

    describe('POST /api/gewoontes',() => {
        const gewoontesToDelete = []
        const gebruikersToDelete = []

        beforeAll(async () => {
            await knex(tables.gebruikers).insert(data.gebruikers);
        });

        afterAll(async () => {
            await knex(tables.gewoontes)
            .whereIn('id',gewoontesToDelete)
            .delete();

            await knex(tables.gebruikers)
            .whereIn('id',gebruikersToDelete)
            .delete();
        })

        it('should return 201 and return created gewoonte',async () =>{
            const response = await request.post(url)
                .send({
                    
                });
        });
    });
});