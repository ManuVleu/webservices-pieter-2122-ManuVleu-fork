const Router = require('@koa/router');
const statsService = require('../service/stats');

const getAllStats = async (ctx) => {
	ctx.body = await statsService.getAll();
};

const createStat = async (ctx) => {
	const newStat = await statsService.create(ctx.request.body);
	ctx.body = newStats;
};

const getStatById = async (ctx) => {
	ctx.body = await statsService.getById(ctx.params.id);
};

const updateStat = async (ctx) => {
	ctx.body = await statsService.updateById(ctx.params.id, ctx.request.body);
};

const deleteStat = async (ctx) => {
	await statsService.deleteById(ctx.params.id);
	ctx.status = 204;
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
	const router = new Router({
		prefix: '/stats',
	});

	router.get('/', getAllStats);
	router.post('/', createStat);
	router.get('/:id', getStatById);
	router.put('/:id', updateStat);
	router.delete('/:id', deleteStat);

	app.use(router.routes()).use(router.allowedMethods());
};