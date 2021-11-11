import Koa = require('koa');
import koaCors = require('@koa/cors');
import Router = require('@koa/router');
import config = require('config');
import { initializeLogger,getLogger } = require('./core/logging');
import bodyParser = require('koa-bodyparser');
//add rest en data

const NODE_ENV = config.get('env');
const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');

async function main(){
	initializeLogger({
		level: LOG_LEVEL,
		disabled: LOG_DISABLED,
		isProduction: NODE_ENV === 'production',
		defaultMeta: { NODE_ENV },
	});

	//await initializeData();

	const app = new Koa();	
	
	app.use(
		koaCors({
			origin: (ctx) => {
				if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
					return ctx.request.header.origin;
				}
				
				return CORS_ORIGINS[0];
			},
			allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
			maxAge: CORS_MAX_AGE,
		})
	);

  const logger = getLogger();
	
  app.use(bodyParser());
	
  //installRest(app);
	
  app.listen(9000);
  logger.info(`🚀< Server listening on http://localhost:9000`);
}

main();