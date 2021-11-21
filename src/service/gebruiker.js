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
	const count = await gebruikerRepo.findCount();
	return {
		data,
		count,
		limit,
		offset
	};
};

/**
 * Registreren nieuwe gebruiker
 *
 * @param {object} gebruiker - De gebruiker.
 * @param {string} gebruiker.naam - De gebruikers naam.
 */
const register = ({ naam }) => {
	getLogger().debug('Aanmaken nieuwe gebruiker', { naam });
  return gebruikerRepo.create({
    naam,
  });
};

module.exports = {
	getAll,
	register,
};
