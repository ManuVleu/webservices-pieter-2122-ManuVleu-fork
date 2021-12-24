const Router = require('@koa/router');
const Joi = require('joi');
const stockmarketService = require('../service/stockmarket');
const { requireAuthentication } = require('../core/auth');

const validate = require('./validation');

const getAllStockmarket = async (ctx) => {
	const stockmarket = await stockmarketService.getAll(
		ctx.query.limit && Number(ctx.query.limit),
		ctx.query.offset && Number(ctx.query.offset),
	);
	ctx.body = stockmarket;
};
getAllStockmarket.validationScheme = {
	query: Joi.object({
		limit: Joi.number().integer().positive().max(1000).optional(),
		offset: Joi.number().integer().min(0).optional(),
	}).and('limit','offset'),
};

const createStockmarket = async (ctx) => {
	const newStockmarket = await stockmarketService.create({
		...ctx.request.body,
		gebruikersID: ctx.state.session.gebruikersID,
	});
	ctx.body = newStockmarket;
	ctx.status = 201;
};
createStockmarket.validationScheme = {
	body: {
		geldBedrijfA: Joi.number().positive(),
		geldBedrijfB: Joi.number().positive(),
		geldBedrijfC: Joi.number().positive(),
	}
}

const getStockmarketById = async (ctx) => {
	ctx.body = await stockmarketService.getById(ctx.params.id);
};
getStockmarketById.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

const updateStockmarket = async (ctx) => {
	ctx.body = await stockmarketService.updateById(ctx.params.id, {
		...ctx.request.body,
		gebruikersID: ctx.state.session.gebruikersID,
	});
};
updateStockmarket.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
	body: {
		geldBedrijfA: Joi.number().positive(),
		geldBedrijfB: Joi.number().positive(),
		geldBedrijfC: Joi.number().positive(),
	}
}

const deleteStockmarket = async (ctx) => {
	await stockmarketService.deleteById(ctx.params.id);
	ctx.status = 204;
};
deleteStockmarket.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	}
}

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
	const router = new Router({
		prefix: '/stockmarket',
	});

	router.get('/',requireAuthentication, validate(getAllStockmarket.validationScheme),getAllStockmarket);
	router.post('/', requireAuthentication, validate(createStockmarket.validationScheme),createStockmarket);
	router.get('/:id',requireAuthentication, validate(getStockmarketById.validationScheme), getStockmarketById);
	router.put('/:id',requireAuthentication, validate(updateStockmarket.validationScheme), updateStockmarket);
	router.delete('/:id',requireAuthentication, validate(deleteStockmarket.validationScheme), deleteStockmarket);

	app.use(router.routes()).use(router.allowedMethods());
};