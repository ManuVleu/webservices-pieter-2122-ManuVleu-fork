const Router = require('@koa/router');
const gebruikerService = require('../service/gebruiker');

const getAllGebruikers = async (ctx) => {
	const gebruikers = await gebruikerService.getAll(
		ctx.query.limit && Number(ctx.query.limit),
		ctx.query.offset && Number(ctx.query.offset),
	);
	ctx.body = gebruikers;
};

const createGebruiker = async (ctx) => {
	const newGebruiker = await gebruikerService.register(ctx.request.body);
	ctx.body = newGebruiker;
};

const getGebruikerById = async (ctx) => {
	ctx.body = await gebruikerService.getById(ctx.params.id);
};

const deleteGebruiker = async (ctx) => {
	await gebruikerService.deleteById(ctx.params.id);
	ctx.status = 204;
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = function installGebruikerRouter(app) {
	const router = new Router({
		prefix: '/gebruikers',
	});

	router.get('/', getAllGebruikers);
	router.post('/', createGebruiker);
	router.get('/:id', getGebruikerById);
	router.delete('/:id', deleteGebruiker);

	app.use(router.routes()).use(router.allowedMethods());
};