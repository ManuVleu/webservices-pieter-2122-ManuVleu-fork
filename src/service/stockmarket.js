const config = require('config');
const { getChildLogger } = require('../core/logging');
const stockmarketRepo = require('../repository/stockmarket');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('stockmarket-service');
	this.logger.debug(message, meta);
};

/**
 * Get all `limit` stockmarket, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of stockmarket to fetch.
 * @param {number} [offset] - Nr of stockmarket to skip.
 */
 const getAll = async (
	limit = DEFAULT_PAGINATION_LIMIT,
	offset = DEFAULT_PAGINATION_OFFSET,
) => {
	debugLog('Ophalen van alle stockmarket',{ limit, offset });
	const data = await stockmarketRepo.findAll({ limit, offset });
	const count = await stockmarketRepo.findCount();
	return {
		data,
		count,
		limit,
		offset,
	};
};

/**
 * Get the stockmarket with the given `gebruikersid`.
 *
 * @param {number} gebruikersid - id van de gebruiker van de stockmarket to get.
 */
const getById = async (gebruikersid) => {
	debugLog(`Ophalen stockmarket met gebruikersid ${gebruikersid}`);
	const stockmarket = stockmarketRepo.findById(gebruikersid);

	if(!stockmarket){
		throw new Error(`Er bestaat geen stockmarket voor de gebruiker met gebruikersid ${gebruikersid}`);
	}

	return stockmarket;
};

/**
 * Create a new stockmarket.
 *
 * @param {object} stockmarket - The stockmarket to create.
 * @param {number} stockmarket.gebruikersid - de id van de gebruiker voor zijn stockmarket.
 */
const create = async ({gebruikersID}) => {
    
	debugLog('Nieuwe stockmarket gemaakt', { gebruikersID });
	

	return stockmarketRepo.create({
		gebruikersID,
	});
};

/**
 * Update an existing stockmarket.
 *
 * @param {string} id - Id van de gebruiker om zijn stockmarkets up te daten.
 * @param {object} stockmarket - The stockmarket data to save.
 * @param {string} [stockmarket.geldBedrijfA] - Geld geïnvesteerd in bedrijf A.
 * @param {Date} [stockmarket.geldBedrijfB] - Geld geïnvesteerd in bedrijf B.
 * @param {string} [stockmarket.geldBedrijfC] - Geld geïnvesteerd in bedrijf C.
 */
const updateById = async (gebruikersID, {geldBedrijfA,geldBedrijfB,geldBedrijfC}) => {
	debugLog(`Updating stockmarket met gebruikersid ${gebruikersID}`, { geldBedrijfA,geldBedrijfB,geldBedrijfC });
    
	return stockmarketRepo.updateById(gebruikersID, {
		geldBedrijfA,geldBedrijfB,geldBedrijfC,
	});
};

/**
 * Delete the stockmarket with the given `id`.
 *
 * @param {number} id - Id van de gebruiker om zijn stockmarket te deleten.
 */
const deleteById = async (id) => {
	debugLog(`Verwijderen van stockmarket met id ${id}`);
	await stockmarketRepo.deleteById(id);
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
