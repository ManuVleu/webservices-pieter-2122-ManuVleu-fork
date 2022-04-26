const Router = require('@koa/router');
const { getChildLogger } = require('../core/logging');
const Joi = require('joi');
const gebruikerService = require('../service/gebruiker');
const Role = require('../core/roles');
const { requireAuthentication, makeRequireRole } = require('../core/auth');

const validate = require('./validation');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('gebruiker-rest');
	this.logger.debug(message, meta);
};

const login = async (ctx) => {
	const { naam, wachtwoord } = ctx.request.body;
	const session = await gebruikerService.login(naam,wachtwoord);
	ctx.body = session;
};
login.validationScheme = {
	body: {
		naam: Joi.string().max(255),
		wachtwoord: Joi.string().min(2).max(25),
	},
};

const getAllGebruikers = async (ctx) => {
	const gebruikers = await gebruikerService.getAll(
		ctx.query.limit && Number(ctx.query.limit),
		ctx.query.offset && Number(ctx.query.offset),
	);
	ctx.body = gebruikers;
};
getAllGebruikers.validationScheme = {
	query: Joi.object({
		limit: Joi.number().integer().positive().max(1000).optional(),
		offset: Joi.number().integer().min(0).optional(),
	}).and('limit','offset'),
};

const register = async (ctx) => {
	const session = await gebruikerService.register(ctx.request.body);
	ctx.body = session;
};
register.validationScheme = {
	body: {
		naam: Joi.string().max(255),
		wachtwoord: Joi.string().min(8).max(30),
	},
};

const getGebruikerById = async (ctx) => {
	const gebruiker = await gebruikerService.getById(ctx.params.id);
	ctx.body = gebruiker;
};
getGebruikerById.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

const deleteGebruiker = async (ctx) => {
	await gebruikerService.deleteById(ctx.params.id);
	ctx.status = 204;
};
deleteGebruiker.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = function installGebruikerRouter(app) {
	const router = new Router({
		prefix: '/gebruikers',
	});

	router.post('/login',validate(login.validationScheme),login);
	router.post('/register',validate(register.validationScheme),register);

	const requireAdmin = makeRequireRole(Role.ADMIN);

	router.get('/',requireAuthentication,requireAdmin,validate(getAllGebruikers.validationScheme), getAllGebruikers);
	router.get('/:id',requireAuthentication, validate(getGebruikerById.validationScheme), getGebruikerById);
	router.delete('/:id',requireAuthentication, validate(deleteGebruiker.validationScheme), deleteGebruiker);

	app.use(router.routes()).use(router.allowedMethods());
};