const config = require('config');
const { getChildLogger } = require('../core/logging');
const stockmarketRepo = require('../repository/stockmarket');
const gebruikerService = require('../service/gebruiker');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('stockmarket-service');
	this.logger.debug(message, meta);
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
const create = async ({gebruikersnaam}) => {
    
	debugLog('Nieuwe stockmarket gemaakt', { gebruikersnaam });
	
	// For now simply create a new user every time
	const { id: gebruikerID } = await gebruikerService.register({ naam: gebruikersnaam });

	return stockmarketRepo.create({
		gebruikerID,
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
const updateById = (gebruikersID) => {
	debugLog(`Updating stockmarket met gebruikersid ${gebruikersID}`, { gewoonteIDMeest, meestGeld, meestStockmarket,geld });
    
	return stockmarketRepo.updateById(id, {
		geldBedrijfA,geldBedrijfB,geldBedrijfC,
	});
};

/**
 * Delete the stockmarket with the given `id`.
 *
 * @param {number} id - Id van de gebruiker om zijn stockmarket te deleten.
 */
const deleteById = (id) => {
	debugLog(`Verwijderen van stockmarket met id ${id}`);
	await stockmarketRepo.deleteById(id);
};

module.exports = {
	getById,
	create,
	updateById,
	deleteById,
};
