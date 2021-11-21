const Router = require('@koa/router');
const stockmarketService = require('../service/stockmarket');

const getAllStockmarkets = async (ctx) => {
	ctx.body = stockmarketService.getAll();
};

const createStockmarket = async (ctx) => {
	const newStockmarket = stockmarketService.create(ctx.request.body);
	ctx.body = newStockmarket;
};

const getStockmarketById = async (ctx) => {
	ctx.body = stockmarketService.getById(ctx.params.id);
};

const updateStockmarket = async (ctx) => {
	ctx.body = stockmarketService.updateById(ctx.params.id, ctx.request.body);
};

const deleteStockmarket = async (ctx) => {
	stockmarketService.deleteById(ctx.params.id);
	ctx.status = 204;
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
	const router = new Router({
		prefix: '/stockmarkets',
	});

	router.get('/', getAllStockmarkets);
	router.post('/', createStockmarket);
	router.get('/:id', getStockmarketById);
	router.put('/:id', updateStockmarket);
	router.delete('/:id', deleteStockmarket);

	app.use(router.routes()).use(router.allowedMethods());
};