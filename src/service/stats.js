const config = require('config');
const { getChildLogger } = require('../core/logging');
const statRepo = require('../repository/stats');
const gebruikerService = require('../service/gebruiker');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('stat-service');
	this.logger.debug(message, meta);
};

/**
 * Get the stat with the given `gebruikersid`.
 *
 * @param {number} gebruikersid - id van de gebruiker van de stat to get.
 */
const getById = async (gebruikersid) => {
	debugLog(`Ophalen stat met gebruikersid ${gebruikersid}`);
	const stat = statRepo.findById(gebruikersid);

	if(!stat){
		throw new Error(`Er bestaat geen stats voor de gebruiker met gebruikersid ${gebruikersid}`);
	}

	return stat;
};

/**
 * Create a new stat.
 *
 * @param {object} stat - The stat to create.
 * @param {number} stat.gebruikersid - de id van de gebruiker voor zijn stats.
 */
const create = async ({gebruikersnaam}) => {
    
	debugLog('Nieuwe stat gemaakt', { gebruikersnaam });
	
	// For now simply create a new user every time
	const { id: gebruikerID } = await gebruikerService.register({ naam: gebruikersnaam });

	return statRepo.create({
		gebruikerID,
	});
};

/**
 * Update an existing stat.
 *
 * @param {string} id - Id van de gebruiker om zijn stats up te daten.
 * @param {object} stat - The stat data to save.
 * @param {string} [stat.gewoonteIDMeest] - id van gewoonte die meest is voltooid.
 * @param {Date} [stat.meestGeld] - Het meest aantal geld dat de gebruiker ooit had.
 * @param {string} [stat.meestStockmarket] - Het meeste aantal winst dat de gebruiker ooit heeft behaald met de stockmarket.
 * @param {string} [stat.huidigAantalGeld] - Het huidig aantal geld dat de gebruiker bezit.
 */
const updateById = (gebruikersID) => {
	debugLog(`Updating stat met gebruikersid ${gebruikersID}`, { gewoonteIDMeest, meestGeld, meestStockmarket,geld });
    
	return statRepo.updateById(id, {
		gewoonteIDMeest, meestGeld, meestStockmarket,geld,
	});
};

/**
 * Delete the stat with the given `id`.
 *
 * @param {number} id - Id van de gebruiker om zijn stats te deleten.
 */
const deleteById = (id) => {
	debugLog(`Verwijderen van stat met id ${id}`);
	await statRepo.deleteById(id);
};

module.exports = {
	getById,
	create,
	updateById,
	deleteById,
};
