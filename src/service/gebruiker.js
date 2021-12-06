const { getChildLogger } = require('../core/logging');
const gebruikerRepo = require('../repository/gebruiker');
const config = require('config');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('gebruiker-service');
	this.logger.debug(message, meta);
};

/**
 * Get all `limit` gebruikers, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of transactions to fetch.
 * @param {number} [offset] - Nr of transactions to skip.
 */
 const getAll = async (
	limit = DEFAULT_PAGINATION_LIMIT,
	offset = DEFAULT_PAGINATION_OFFSET,
) => {
	debugLog('Fetching all gebruikers', { limit, offset });
	const data = await gebruikerRepo.findAll({ limit, offset });
	const totalCount = await gebruikerRepo.findCount();
	return {
		data,
		count: totalCount,
		limit,
		offset
	};
};

/**
 * 
 * @param {object} gebruiker - De gebruiker. 
 * @param {string} gebruiker.id - De id van de gebruiker
 */
const getById = async ( id ) => {
	debugLog('Fetching gebruiker met id ',{id});
	return await gebruikerRepo.findById(id);
}

/**
 * Registreren nieuwe gebruiker
 *
 * @param {object} gebruiker - De gebruiker.
 * @param {string} gebruiker.naam - De gebruikers naam.
 * @param {string} gebruiker.wachtwoord - Het wachtwoord van de gebruiker.
 */
const register = async ({ naam,wachtwoord }) => {
	debugLog('Aanmaken nieuwe gebruiker', { naam,wachtwoord });
  return gebruikerRepo.create({
    naam,wachtwoord
  });
};

/**
 * Delete the gebruiker with the given `id`.
 *
 * @param {number} id - Id of the gebruiker to delete.
 */
 const deleteById = async (id) => {
	debugLog(`Verwijderen van gebruiker met id ${id}`);
	await gebruikerRepo.deleteById(id);
};

module.exports = {
	getAll,
	getById,
	register,
	deleteById,
};
