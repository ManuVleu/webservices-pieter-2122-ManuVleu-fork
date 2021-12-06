const config = require('config');
const { getChildLogger } = require('../core/logging');
const statRepo = require('../repository/stats');
const gebruikerService = require('../service/gebruiker');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('stat-service');
	this.logger.debug(message, meta);
};

/**
 * Get all `limit` stats, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of stats to fetch.
 * @param {number} [offset] - Nr of stats to skip.
 */
 const getAll = async (
	limit = DEFAULT_PAGINATION_LIMIT,
	offset = DEFAULT_PAGINATION_OFFSET,
) => {
	debugLog('Ophalen van alle stats',{ limit, offset });
	const data = await statRepo.findAll({ limit, offset });
	const count = await statRepo.findCount();
	return {
		data,
		count,
		limit,
		offset
	};
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
const create = async ({gebruikersID}) => {
    
	debugLog('Nieuwe stat gemaakt', { gebruikersID });

	return statRepo.create({
		gebruikersID,
	});
};

/**
 * Update an existing stat.
 *
 * @param {object} stat - The stat data to save.
 * @param {string} stat.gebruikersID - id van de gebruiker van de stats.
 * @param {string} [stat.gewoonteIDMeestVoltooid] - id van gewoonte die meest is voltooid.
 * @param {Date} [stat.meesteGeldOoit] - Het meest aantal geld dat de gebruiker ooit had.
 * @param {string} [stat.meestWinstStockmarketOoit] - Het meeste aantal winst dat de gebruiker ooit heeft behaald met de stockmarket.
 * @param {string} [stat.geld] - Het huidig aantal geld dat de gebruiker bezit.
 */
const updateById = async (gebruikersID, { gewoonteIDMeestVoltooid, meesteGeldOoit, meestWinstStockmarketOoit,geld }) => {
	debugLog(`Updating stat met gebruikersid ${gebruikersID}`, { gewoonteIDMeestVoltooid, meesteGeldOoit, meestWinstStockmarketOoit,geld });
    
	return statRepo.updateById(gebruikersID, {
		gewoonteIDMeestVoltooid, meesteGeldOoit, meestWinstStockmarketOoit,geld
	});
};

/**
 * Delete the stat with the given `id`.
 *
 * @param {number} id - Id van de gebruiker om zijn stats te deleten.
 */
const deleteById = async (id) => {
	debugLog(`Verwijderen van stat met id ${id}`);
	await statRepo.deleteById(id);
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
