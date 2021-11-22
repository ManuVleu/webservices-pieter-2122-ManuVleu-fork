const Router = require('@koa/router');
const taakService = require('../service/taak');

const getAllTaken = async (ctx) => {
	ctx.body = await taakService.getAll();
};

const createTaak = async (ctx) => {
	const newTaak = await taakService.create(ctx.request.body);
	ctx.body = newTaak;
};

const getTaakById = async (ctx) => {
	ctx.body = await taakService.getById(ctx.params.id);
};

const updateTaak = async (ctx) => {
	ctx.body = await taakService.updateById(ctx.params.id, ctx.request.body);
};

const deleteTaak = async (ctx) => {
	await taakService.deleteById(ctx.params.id);
	ctx.status = 204;
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
	const router = new Router({
		prefix: '/taken',
	});

	router.get('/', getAllTaken);
	router.post('/', createTaak);
	router.get('/:id', getTaakById);
	router.put('/:id', updateTaak);
	router.delete('/:id', deleteTaak);

	app.use(router.routes()).use(router.allowedMethods());
};
