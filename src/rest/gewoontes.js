const Router = require('@koa/router');
const Joi = require('joi');
const { requireAuthentication } = require('../core/auth');
const gewoonteService = require('../service/gewoonte');

const validate = require('./validation');

const getAllGewoontes = async (ctx) => {
	const gewoontes = await gewoonteService.getAll(
		ctx.query.limit && Number(ctx.query.limit),
		ctx.query.offset && Number(ctx.query.offset),
	);
	ctx.body = gewoontes;
};
getAllGewoontes.validationScheme = {
	query: Joi.object({
		limit: Joi.number().integer().positive().max(1000).optional(),
		offset: Joi.number().integer().min(0).optional(),
	}).and('limit','offset'),
};

const createGewoonte = async (ctx) => {
	const newGewoonte = await gewoonteService.create(
		ctx.request.body,
);
	console.log('In de resttttttttttttttttttttttttttttttttttttttt');
	ctx.body = newGewoonte;
	ctx.status = 201;
};
createGewoonte.validationScheme = {
	body: {
		gebruikersID: Joi.string().uuid(),
		naam: Joi.string(),
		geldBijVoltooiing: Joi.number().min(0),
		soortHerhaling: Joi.string(),
	},
};

const getGewoonteById = async (ctx) => {
	ctx.body = await gewoonteService.getById(ctx.params.id);
};
getGewoonteById.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

const updateGewoonte = async (ctx) => {
	ctx.body = await gewoonteService.updateById(ctx.params.id, {
		...ctx.request.body,
		gebruikersID: ctx.state.session.gebruikersID,
		startDatum: new Date(ctx.request.body.startDatum),
		laatsteKeerVoltooid: new Date(ctx.request.body.laatsteKeerVoltooid),
	});
};
updateGewoonte.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
	body: {
		naam: Joi.string(),
		geldBijVoltooiing: Joi.number().min(0),
		soortHerhaling: Joi.string(),
		aantalKeerVoltooid: Joi.number().min(0),
		laatsteKeerVoltooid: Joi.date().iso().less('now'),
	},
};

const deleteGewoonte = async (ctx) => {
	await gewoonteService.deleteById(ctx.params.id);
	ctx.status = 204;
};
deleteGewoonte.validationScheme = {
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
		prefix: '/gewoontes',
	});

	router.get('/', requireAuthentication, validate(getAllGewoontes.validationScheme), getAllGewoontes);
	router.post('/', requireAuthentication, validate(createGewoonte.validationScheme), createGewoonte);
	router.get('/:id', requireAuthentication, validate(getGewoonteById.validationScheme), getGewoonteById);
	router.put('/:id', requireAuthentication, validate(updateGewoonte.validationScheme), updateGewoonte);
	router.delete('/:id', requireAuthentication, validate(deleteGewoonte.validationScheme), deleteGewoonte);

	app.use(router.routes()).use(router.allowedMethods());
};