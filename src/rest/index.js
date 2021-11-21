const Router = require('@koa/router');
const installGebruikerRouter = require('./gebruikers');
const installHealthRouter = require('./health');
const installGewoonteRouter = require('./gewoontes');
const installTaakRouter = require('./taken');
const installStatsRouter = require('./stats');
const installStockmarketRouter = require('./stockmarket');

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
	const router = new Router({
		prefix: '/api',
	});

	installGebruikerRouter(router);
	installHealthRouter(router);
    installGewoonteRouter(router);
    installTaakRouter(router);
    installStatsRouter(router);
    installStockmarketRouter(router);

	app.use(router.routes()).use(router.allowedMethods());
};
