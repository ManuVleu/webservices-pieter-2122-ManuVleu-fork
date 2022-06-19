const { request } = require("http");
const { url } = require("inspector");
const { default: knex } = require("knex");
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
    }]
};

describe('gewoontes',() => {
    let request;
    let knex;
    let loginHeader;

    withServer(({ knex: k, supertest:s }) => {
        knex = k;
        request = s;
    });

    beforeAll(async () => {
        loginHeader = await login(request);
    });

    describe('GET /api/gewoontes',() => {
        beforeAll(async () => {
            await knex(tables.gewoontes).insert(data.gewoontes);
          });
      
          afterAll(async () => {
            await knex(tables.gewoontes)
              .whereIn('gewoonteID', gewoontesToDelete)
              .delete();
          });

        it('should return 200 and list of gewoontes',async () => {
            const response = await request.get(`${url}?limit=3`).set('Authorization', loginHeader);
            expect(response.status).toBe(200);
            expect(response.body.limit).toBe(3);
		    expect(response.body.data.length).toBe(3);
            expect(response.body.data[0]).toEqual(
                data.gewoontes
            );
        });

        it('should return 200 and a specific gewoonte',async () => {
            const response = await request.get(`${url}/360e6bbd-5ed4-466e-97f1-3ee356c277b7`).set('Authorization', loginHeader);
            expect(response.status).toBe(200)
            expect(response.data.length).toBe(1);
            expect(response.body.data[0]).toEqual(
                data.gewoontes[0]
            );
        })
    });

    describe('POST /api/gewoontes',() => {
        const gewoontesToDelete = []

        beforeAll(async () => {
            await knex(tables.gewoontes).insert(data.gewoontes);
          });

        afterAll(async () => {
            await knex(tables.gewoontes)
            .whereIn('gewoonteID',gewoontesToDelete)
            .delete();
        })

        it('should return 201 and return created gewoonte',async () =>{
            const response = await request.post(url).set('Authorization', loginHeader)
                .send({
                        gebruikersID: '9dd24a11-6fe3-4d3c-8e25-f311b1f4afe5',
                        naam: 'TestGewoonte',
                        geldBijVoltooiing: 60,
                        soortHerhaling: 'Wekelijks',
                });
            
            expect(response.status).toBe(201);
            expect(response.body.gewoonteID).toBeTruthy()
            expect(response.body.gebruikersID).toBe('9dd24a11-6fe3-4d3c-8e25-f311b1f4afe5')
            expect(response.body.naam).toBe('TestGewoonte')
            expect(response.body.startDatum).toBeTruthy()
            expect(response.body.geldBijVoltooiing).toBe(60)
            expect(response.body.aantalKeerVoltooid).toBe(0)
            expect(response.body.laatsteKeerVoltooid).toBeTruthy()
            expect(response.body.soortHerhaling).toBe('Wekelijks')

            gewoontesToDelete.push(response.body.gewoonteID)
        });
    });

    describe('PUT /api/gewoontes',() => {
        beforeAll(async () => {
            await knex(tables.gewoontes).insert(data.gewoontes);
          });

        const gewoonteChanged = {
                gewoonteID: '8a307ca2-b393-4847-80b6-fa9f22e6e7a9',
                gebruikersID: '1706481d-ae5a-4bcf-9ee3-20e71746e19c',
                naam: '5km lopen',
                startDatum: '2021-11-08',
                geldBijVoltooiing: 40,
                aantalKeerVoltooid: 2,
                laatsteKeerVoltooid: '2021-11-21',
                soortHerhaling: 'Wekelijks',
        }

        afterAll(async () => {
            await knex(tables.gewoontes)
            .whereIn('gewoonteID',gewoontesToDelete)
            .update(gewoonteChanged);
        })

        it('should return 200 and return updated gewoonte',async () =>{
            const response = await request.post(`${url}/8a307ca2-b393-4847-80b6-fa9f22e6e7a9`).set('Authorization', loginHeader)
                .send({
                        gebruikersID: '9dd25a11-6fe3-4d3c-8e25-f311b1f4afe5',
                        naam: 'GeupdateGewoonte',
                        geldBijVoltooiing: 68,
                        soortHerhaling: 'Dagelijks',
                });
            
            expect(response.status).toBe(200);
            expect(response.body.gewoonteID).toBe('8a307ca2-b393-4847-80b6-fa9f22e6e7a9')
            expect(response.body.gebruikersID).toBe('9dd25a11-6fe3-4d3c-8e25-f311b1f4afe5')
            expect(response.body.naam).toBe('GeupdateGewoonte')
            expect(response.body.startDatum).toBe('2021-11-08')
            expect(response.body.geldBijVoltooiing).toBe(68)
            expect(response.body.aantalKeerVoltooid).toBe(2)
            expect(response.body.laatsteKeerVoltooid).toBe('2021-11-21')
            expect(response.body.soortHerhaling).toBe('Dagelijks')

        });
    });

    describe('DELETE /api/gewoontes/?id',() => {
        const gewoonteToAdd = {
            gewoonteID: '8a307ca2-b393-4847-80b6-fa9f22e6e7a9',
            gebruikersID: '1706481d-ae5a-4bcf-9ee3-20e71746e19c',
            naam: '5km lopen',
            startDatum: '2021-11-08',
            geldBijVoltooiing: 40,
            aantalKeerVoltooid: 2,
            laatsteKeerVoltooid: '2021-11-21',
            soortHerhaling: 'Wekelijks',
        }

        beforeAll(async () => {
            await knex(tables.gewoontes).insert(data.gewoontes);
          });

        afterAll(async () => {
            await knex(tables.gewoontes)
            .whereIn('gewoonteID',gewoonteToAdd)
            .insert(gewoonteToAdd);
        });

        it('should return 204 and return true',async () => {
            const response = await request.delete(`${url}/${gewoonteToAdd.gewoonteID}`).set('Authorization', loginHeader)

            expect(response.status).toBe(204);
            expect(response.body[0]).toBe(true)

        })

    });
});