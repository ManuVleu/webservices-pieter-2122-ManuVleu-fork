const Router = require('@koa/router');
const Joi = require('joi');
const { requireAuthentication } = require('../core/auth');
const taakService = require('../service/taak');

const validate = require('./validation');

const getAllTaken = async (ctx) => {
	const taken = await taakService.getAll(
		ctx.query.limit && Number(ctx.query.limit),
		ctx.query.offset && Number(ctx.query.offset),
	);
	ctx.body = taken;
};
getAllTaken.validationScheme = {
	query: Joi.object({
		limit: Joi.number().integer().positive().max(1000).optional(),
		offset: Joi.number().integer().min(0).optional(),
	}).and('limit','offset'),
};

const createTaak = async (ctx) => {
	const newTaak = await taakService.create({
		...ctx.request.body,
		gebruikersID: ctx.state.session.gebruikersID,
		eindDatum: new Date(ctx.request.body.eindDatum),
	});
	ctx.body = newTaak;
	ctx.status = 201;
};
createTaak.validationScheme = {
	body: {
		naam: Joi.string().max(255),
		geldBijVoltooiing: Joi.number().min(0),
		eindDatum: Joi.date().iso().greater('now'),
	}
}

const getTaakById = async (ctx) => {
	ctx.body = await taakService.getById(ctx.params.id);
};
getTaakById.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

const updateTaak = async (ctx) => {
	ctx.body = await taakService.updateById(ctx.params.id, {
		...ctx.request.body,
		gebruikersID: ctx.state.session.gebruikersID,
		eindDatum: new Date(ctx.request.body.date),
	});
};
updateTaak.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
	body: {
		naam: Joi.string().max(255),
		geldBijVoltooiing: Joi.number().min(0),
		eindDatum: Joi.date().iso().greater('now'),
	}
}

const deleteTaak = async (ctx) => {
	await taakService.deleteById(ctx.params.id);
	ctx.status = 204;
};
deleteTaak.validationScheme = {
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
		prefix: '/taken',
	});

	router.get('/', requireAuthentication, validate(getAllTaken.validationScheme), getAllTaken);
	router.post('/', requireAuthentication, validate(createTaak.validationScheme), createTaak);
	router.get('/:id', requireAuthentication, validate(getTaakById.validationScheme), getTaakById);
	router.put('/:id', requireAuthentication, validate(updateTaak.validationScheme), updateTaak);
	router.delete('/:id', requireAuthentication, validate(deleteTaak.validationScheme), deleteTaak);

	app.use(router.routes()).use(router.allowedMethods());
};
