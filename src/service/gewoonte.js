const config = require('config');
const { getChildLogger } = require('../core/logging');
const gewoonteRepo = require('../repository/gewoonte');
const gebruikerService = require('../service/gebruiker');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('gewoonte-service');
	this.logger.debug(message, meta);
};

/**
 * Get all `limit` gewoontes, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of gewoontes to fetch.
 * @param {number} [offset] - Nr of gewoontes to skip.
 */
const getAll = async (
	limit = DEFAULT_PAGINATION_LIMIT,
	offset = DEFAULT_PAGINATION_OFFSET,
) => {
	debugLog('Ophalen van alle gewoontes',{ limit, offset });
	const data = await gewoonteRepo.findAll({ limit, offset });
	const count = await gewoonteRepo.findCount();
	return {
		data,
		count,
		limit,
		offset
	};
};

/**
 * Get the gewoonte with the given `id`.
 *
 * @param {number} id - Id of the gewoonte to find.
 */
const getById = async (id) => {
	debugLog(`Ophalen gewoonte met id ${id}`);
	const gewoonte = await gewoonteRepo.findById(id);

	if (!gewoonte) {
		throw new Error(`There is no gewoonte with id ${id}`);
	}

	return gewoonte;
};

/**
 * Create a new gewoonte.
 *
 * @param {object} gewoonte - The gewoonte to create.
 * @param {string} gewoonte.gebruikersID - De id van de gebruiker van de gewoonte.
 * @param {string} gewoonte.naam - Naam van de gewoonte.
 * @param {string} gewoonte.soortHerhaling - Soort van gewoonte, kan alleen 'Dagelijks','Wekelijks' of 'Maandelijks' zijn.
 * @param {number} gewoonte.geldBijVoltooiing - geld die de gewoonte opbrengt als je het voltooid.
 */
const create = async ({ gebruikersID,naam, geldBijVoltooiing, soortHerhaling }) => {
	//in repo
    //const today = new Date();
    //const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	debugLog('Nieuwe gewoonte aan het maken', {gebruikersID,naam, geldBijVoltooiing, soortHerhaling});

	return gewoonteRepo.create({
		gebruikersID,naam, geldBijVoltooiing, soortHerhaling
	});
};

/**
 * Update an existing gewoonte.
 *
 * @param {object} gewoonte - The gewoonte to create.
 * @param {string} gewoonte.gewoonteID - De id van de gewoonte.
 * @param {string} gewoonte.naam - Naam van de gewoonte.
 * @param {string} gewoonte.soortHerhaling - Soort van gewoonte, kan alleen 'Dagelijks','Wekelijks' of 'Maandelijks' zijn.
 * @param {number} gewoonte.geldBijVoltooiing - geld die de gewoonte opbrengt als je het voltooid.
 * @param {number} gewoonte.aantalKeerVoltooid - Aantal keer gewoonte is voltooid.
 * @param {date} gewoonte.laatsteKeerVoltooid - Datum wanneer gewoonte laatste keer is voltooid.
 */
const updateById = async (gewoonteID, { naam,geldBijVoltooiing,aantalKeerVoltooid,laatsteKeerVoltooid, soortHerhaling  }) => {
	debugLog(`Updating gewoonte met id ${gewoonteID}`, { naam,geldBijVoltooiing,aantalKeerVoltooid,laatsteKeerVoltooid, soortHerhaling });

	return gewoonteRepo.updateById(gewoonteID, {
		naam,geldBijVoltooiing,aantalKeerVoltooid,laatsteKeerVoltooid, soortHerhaling
	});


};

/**
 * Delete the gewoonte with the given `id`.
 *
 * @param {number} id - Id of the gewoonte to delete.
 */
const deleteById = async (id) => {
	debugLog(`Verwijderen van gewoonte met id ${id}`);
	await gewoonteRepo.deleteById(id);
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
