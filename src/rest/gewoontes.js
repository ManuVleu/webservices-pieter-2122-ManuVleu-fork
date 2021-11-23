const Router = require('@koa/router');
const gewoonteService = require('../service/gewoonte');

const getAllGewoontes = async (ctx) => {
	const { limit,offset } = ctx.query;//In de URL ezlf limit en offset meegeven
	ctx.body = await gewoonteService.getAll(Number(limit),Number(offset));
};

const createGewoonte = async (ctx) => {
	const newGewoonte = await gewoonteService.create(ctx.request.body);
	ctx.body = newGewoonte;
};

const getGewoonteById = async (ctx) => {
	ctx.body = await gewoonteService.getById(ctx.params.id);
};

const updateGewoonte = async (ctx) => {
	ctx.body = await gewoonteService.updateById(ctx.params.id, ctx.request.body);
};

const deleteGewoonte = async (ctx) => {
	await gewoonteService.deleteById(ctx.params.id);
	ctx.status = 204;
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
	const router = new Router({
		prefix: '/gewoontes',
	});

	router.get('/', getAllGewoontes);
	router.post('/', createGewoonte);
	router.get('/:id', getGewoonteById);
	router.put('/:id', updateGewoonte);
	router.delete('/:id', deleteGewoonte);

	app.use(router.routes()).use(router.allowedMethods());
};