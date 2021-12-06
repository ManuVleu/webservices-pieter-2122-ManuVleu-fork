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
 * @param {string} taak.gebruikersID - The id van de gebruiker van de taak.
 * @param {string} taak.naam - Naam van de taak.
 * @param {Date} taak.eindDatum - De taak moet voltooid worden voor deze datum.
 * @param {number} taak.geldBijVoltooiing - geld die de taak opbrengt als je het voltooid.
 */
const create = async ({ gebruikersID,naam, geldBijVoltooiing,eindDatum }) => {
	//in repo
    //const today = new Date();
    //const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	debugLog('Nieuwe taak aan het maken', {gebruikersID,naam, geldBijVoltooiing,eindDatum});


	return taakRepo.create({
		gebruikersID,naam, geldBijVoltooiing,eindDatum
	});
};

/**
 * Update an existing taak.
 *
 * @param {object} taak - The taak to create.
 * @param {string} taak.taakID - The id van de taak.
 * @param {string} [taak.naam] - Naam van de taak.
 * @param {Date} [taak.eindDatum] - De taak moet voltooid worden voor deze datum.
 * @param {number} [taak.geldBijVoltooiing] - geld die de taak opbrengt als je het voltooid.
 */
const updateById = async (taakID, { naam,geldBijVoltooiing, eindDatum  }) => {
	debugLog(`Updating taak met id ${taakID}`, { naam,geldBijVoltooiing, eindDatum });

	return taakRepo.updateById(taakID, {
		naam,geldBijVoltooiing, eindDatum
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
