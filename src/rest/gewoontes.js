const Router = require('@koa/router');
const gewoonteService = require('../service/gewoonte');

const getAllGewoontes = async (ctx) => {
	ctx.body = gewoonteService.getAll();
};

const createGewoonte = async (ctx) => {
	const newGewoonte = gewoonteService.create(ctx.request.body);
	ctx.body = newGewoonte;
};

const getGewoonteById = async (ctx) => {
	ctx.body = gewoonteService.getById(ctx.params.id);
};

const updateGewoonte = async (ctx) => {
	ctx.body = gewoonteService.updateById(ctx.params.id, ctx.request.body);
};

const deleteGewoonte = async (ctx) => {
	gewoonteService.deleteById(ctx.params.id);
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