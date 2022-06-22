const Router = require('@koa/router');
const Joi = require('joi');
const statsService = require('../service/stats');
const { requireAuthentication } = require('../core/auth');

const validate = require('./validation');

const getAllStats = async (ctx) => {
	const stats = await statsService.getAll(
		ctx.query.limit && Number(ctx.query.limit),
		ctx.query.offset && Number(ctx.query.offset),
	);
	ctx.body = stats;
};
getAllStats.validationScheme = {
	query: Joi.object({

		limit: Joi.number().integer().positive().max(1000).optional(),
		offset: Joi.number().integer().min(0).optional(),
	}).and('limit','offset'),
};

const createStat = async (ctx) => {
	const newStat = await statsService.create({
		gebruikersID: ctx.request.body.gebruikersID,
	});
	ctx.body = newStat;
	ctx.status = 201;
};
createStat.validationScheme = {
	body: {
		gebruikersID: Joi.string().uuid(),
	},
};

const getStatById = async (ctx) => {
	ctx.body = await statsService.getById(ctx.params.id);
};
getStatById.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

const updateStat = async (ctx) => {
	ctx.body = await statsService.updateById(ctx.params.id, {
		...ctx.request.body,
		gebruikersID: ctx.state.session.gebruikersID,
	});
};
updateStat.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
	body: {
		gewoonteIDMeestVoltooid: Joi.string().uuid(),
		meesteGeldOoit: Joi.number().min(0),
		meestWinstStockmarketOoit: Joi.number().min(0),
		geld: Joi.number().min(0),
	},
};

const deleteStat = async (ctx) => {
	await statsService.deleteById(ctx.params.id);
	ctx.status = 204;
};
deleteStat.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
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

	router.get('/', requireAuthentication, validate(getAllStats.validationScheme), getAllStats);
	router.post('/', requireAuthentication, validate(createStat.validationScheme), createStat);
	router.get('/:id', requireAuthentication, validate(getStatById.validationScheme), getStatById);
	router.put('/:id', requireAuthentication, validate(updateStat.validationScheme), updateStat);
	router.delete('/:id', requireAuthentication, validate(deleteStat.validationScheme), deleteStat);

	app.use(router.routes()).use(router.allowedMethods());
};