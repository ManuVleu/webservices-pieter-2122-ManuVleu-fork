const config = require('config');
const { getChildLogger } = require('../core/logging');
const taakRepo = require('../repository/taak');
const gebruikerService = require('../service/gebruiker');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('taak-service');
	this.logger.debug(message, meta);
};

/**
 * Get all `limit` taken, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of taken to fetch.
 * @param {number} [offset] - Nr of taken to skip.
 */
const getAll = async (
	limit = DEFAULT_PAGINATION_LIMIT,
	offset = DEFAULT_PAGINATION_OFFSET,
) => {
	debugLog('Ophalen van alle taken',{ limit, offset });
	const data = await taakRepo.findAll({ limit, offset });
	const count = await taakRepo.findCount();
	return {
		data,
		count,
		limit,
		offset
	};
};

/**
 * Get the taak with the given `id`.
 *
 * @param {number} id - Id of the taak to find.
 */
const getById = async (id) => {
	debugLog(`Ophalen taak met id ${id}`);
	const taak = await taakRepo.findById(id);

	if (!taak) {
		throw new Error(`There is no taak with id ${id}`);
	}

	return taak;
};

/**
 * Create a new taak.
 *
 * @param {object} taak - The taak to create.
 * @param {string} taak.naam - Naam van de taak.
 * @param {Date} taak.eindDatum - De taak moet voltooid worden voor deze datum.
 * @param {number} taak.punten - Punten die de taak opbrengt als je het voltooid.
 * @param {string} taak.gebruikersnaam - Naam van de gebruiker van de taak.
 */
const create = async ({ naam, eindDatum, punten,gebruikersnaam }) => {
	//in repo
    //const today = new Date();
    //const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	debugLog('Nieuwe taak aan het maken', {naam, eindDatum, punten});
	
	// For now simply create a new user every time
	const { id: gebruikerID } = await gebruikerService.register({ naam: gebruikersnaam });

	return taakRepo.create({
		naam, eindDatum, punten,gebruikerID,
	});
};

/**
 * Update an existing taak.
 *
 * @param {string} id - Id of the transaction to update.
 * @param {object} taak - The taak to create.
 * @param {string} [taak.naam] - naam van de taak.
 * @param {string} [taak.eindDatum] - De taak moet voltooid worden voor deze datum.
 * @param {number} [taak.punten] - punten die de taak opbrengt als je het voltooid.
  * @param {string} [taak.gebruikersnaam] - Naam van de gebruiker van de taak.
 */
const updateById = async (id, { naam, eindDatum, punten }) => {
	debugLog(`Updating taak met id ${id}`, { naam, eindDatum, punten, gebruikersnaam });
    
	const {id: gebruikerID } = await gebruikerService.register({naam: gebruikersnaam});

	return taakRepo.updateById(id, {
		naam,
		eindDatum,
		punten,
		gebruikerID
	});


};

/**
 * Delete the taak with the given `id`.
 *
 * @param {number} id - Id of the taak to delete.
 */
const deleteById = async (id) => {
	debugLog(`Verwijderen van taak met id ${id}`);
	await taakRepo.deleteById(id);
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
