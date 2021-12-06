const Router = require('@koa/router');
const stockmarketService = require('../service/stockmarket');

const getAllStockmarket = async (ctx) => {
	const stockmarket = await stockmarketService.getAll(
		ctx.query.limit && Number(ctx.query.limit),
		ctx.query.offset && Number(ctx.query.offset),
	);
	ctx.body = stockmarket;
};

const createStockmarket = async (ctx) => {
	const newStockmarket = await stockmarketService.create(ctx.request.body);
	ctx.body = newStockmarket;
};

const getStockmarketById = async (ctx) => {
	ctx.body = await stockmarketService.getById(ctx.params.id);
};

const updateStockmarket = async (ctx) => {
	ctx.body = await stockmarketService.updateById(ctx.params.id, ctx.request.body);
};

const deleteStockmarket = async (ctx) => {
	await stockmarketService.deleteById(ctx.params.id);
	ctx.status = 204;
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
	const router = new Router({
		prefix: '/stockmarket',
	});

	router.get('/',getAllStockmarket);
	router.post('/', createStockmarket);
	router.get('/:id', getStockmarketById);
	router.put('/:id', updateStockmarket);
	router.delete('/:id', deleteStockmarket);

	app.use(router.routes()).use(router.allowedMethods());
};