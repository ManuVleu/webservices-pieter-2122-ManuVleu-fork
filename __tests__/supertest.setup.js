const supertest = require('supertest');
const createServer = require('../src/createServer');
const { getKnex } = require('../src/data');

module.exports.withServer = (setter) => {
	let server;

	beforeAll(async () => {
		server = await createServer();

		setter({
			knex: getKnex(),
			supertest: supertest(server.getApp().callback()),
		});
	});

	afterAll(async () => {
		await server.stop();
	});
};


module.exports.login = async (supertest) => {
	const response = await supertest.post('/api/gebruikers/login')
		.send({
			naam: 'TestGebruiker',
			wachtwoord: '123',
		});

	if (response.statusCode !== 200) {
		throw new Error(response.body.message || 'Unknown error occured');
	}

	return `Bearer ${response.body.token}`;
};

module.exports.loginAdmin = async (supertest) => {
	const response = await supertest.post('/api/gebruikers/login')
		.send({
			naam: 'TestAdmin',
			wachtwoord: '123',
		});

	if (response.statusCode !== 200) {
		throw new Error(response.body.message || 'Unknown error occured');
	}

	return `Bearer ${response.body.token}`;
};