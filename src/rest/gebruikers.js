const Router = require('@koa/router');
const gebruikerService = require('../service/gebruiker');

const getAllGebruikers = async (ctx) => {
	ctx.body = await gebruikerService.getAll();
};

const createGebruiker = async (ctx) => {
	const newGebruiker = await gebruikerService.create(ctx.request.body);
	ctx.body = newGebruiker;
};

const getGebruikerById = async (ctx) => {
	ctx.body = await gebruikerService.getById(ctx.params.id);
};

const updateGebruiker = async (ctx) => {
	ctx.body = await gebruikerService.updateById(ctx.params.id, ctx.request.body);
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
module.exports = (app) => {
	const router = new Router({
		prefix: '/gebruikers',
	});

	router.get('/', getAllGebruikers);
	router.post('/', createGebruiker);
	router.get('/:id', getGebruikerById);
	router.put('/:id', updateGebruiker);
	router.delete('/:id', deleteGebruiker);

	app.use(router.routes()).use(router.allowedMethods());
};