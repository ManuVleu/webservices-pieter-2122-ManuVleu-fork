const { getChildLogger } = require('../core/logging');
const gebruikerRepo = require('../repository/gebruiker');
const { verifyPassword,hashPassword } = require('../core/password');
const { generateJWT, verifyJWT } = require('../core/jwt');
const Role = require('../core/roles');
const ServiceError = require('../core/serviceError');
const config = require('config');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('gebruiker-service');
	this.logger.debug(message, meta);
};

/**
 * Only return the public information about the given gebruiker.
 */
 const makeExposedGebruiker = ({
	id,
	name,
	roles,
  }) => ({
	id,
	name,
	roles,
  });
  
  /**
   * Create the returned information after login.
   */
  const makeLoginData = async (gebruiker) => {
	const token = await generateJWT(gebruiker);
  
	return {
	  gebruiker: makeExposedGebruiker(gebruiker),
	  token,
	};
  };
  
  /**
   * Try to login a gebruiker with the given gebruikersnaam and wachtwoord.
   *
   * @param {string} naam - The naam to try.
   * @param {string} wachtwoord - The wachtwoord to try.
   *
   * @returns {Promise<object>} - Promise whichs resolves in an object containing the token and signed in gebruiker.
   */
  const login = async (naam, wachtwoord) => {
	const gebruiker = await gebruikerRepo.findByNaam(naam);
  
	if (!gebruiker) {
	  // DO NOT expose we don't know the gebruiker
	  throw ServiceError.unauthorized('The given naam and wachtwoord do not match');
	}
	
	const wachtwoordValid = await verifyPassword(wachtwoord, gebruiker.wachtwoord);
  
	if (!wachtwoordValid) {
	  // DO NOT expose we know the gebruiker but an invalid password was given
	  throw ServiceError.unauthorized('The given naam and wachtwoord do not match');
	}
	
	return await makeLoginData(gebruiker);
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
		data: data.map(makeExposedGebruiker),
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
	const gebruiker = await gebruikerRepo.findById(id);

	if(!gebruiker){
		throw ServiceError.notFound(`No gebruiker with id ${id} exists`,{id});
	}

	return makeExposedGebruiker(gebruiker);
}

/**
 * Registreren nieuwe gebruiker
 *
 * @param {object} gebruiker - De gebruiker.
 * @param {string} gebruiker.naam - De gebruikers naam.
 * @param {string} gebruiker.wachtwoord - Het wachtwoord van de gebruiker.
 */
const register = async ({ naam,wachtwoord }) => {
	debugLog('Aanmaken nieuwe gebruiker', { naam });
	const wachtwoordHash = await hashPassword(wachtwoord);

	const gebruiker = await gebruikerRepo.create({
		naam,
		wachtwoordHash,
		roles: [Role.GEBRUIKER],
	});

  return await makeLoginData(gebruiker);
};

/**
 * Delete the gebruiker with the given `id`.
 *
 * @param {number} id - Id of the gebruiker to delete.
 */
 const deleteById = async (id) => {
	debugLog(`Verwijderen van gebruiker met id ${id}`);
	const deleted = await gebruikerRepo.deleteById(id);

	if(!deleted){
		throw ServiceError.notFound(`No gebruiker with id ${id} exists`,{ id });
	}
};

/**
 * Check and parse a JWT from the given header into a valid session
 * if possible.
 *
 * @param {string} authHeader - The bare 'Authorization' header to parse
 *
 * @throws {ServiceError} One of:
 * - UNAUTHORIZED: Invalid JWT token provided, possible errors:
 *   - no token provided
 *   - incorrect 'Bearer' prefix
 *   - expired JWT
 *   - other unknown error
 */
 const checkAndParseSession = async (authHeader) => {
	if (!authHeader) {
	  throw ServiceError.unauthorized('You need to be signed in');
	}
  
	if (!authHeader.startsWith('Bearer ')) {
	  throw ServiceError.unauthorized('Invalid authentication token');
	}
  
	const authToken = authHeader.substr(7);
	try {
	  const {
		roles, gebruikersID,
	  } = await verifyJWT(authToken);
  
	  return {
		gebruikersID,
		roles,
		authToken,
	  };
	} catch (error) {
	  const logger = getChildLogger('gebruiker-service');
	  logger.error(error.message, { error });
	  throw ServiceError.unauthorized(error.message);
	}
  };
  
  /**
   * Check if the given roles include the given required role.
   *
   * @param {string} role - Role to require.
   * @param {string[]} roles - Roles of the gebruiker.
   *
   * @returns {void} Only throws if role not included.
   *
   * @throws {ServiceError} One of:
   * - UNAUTHORIZED: Role not included in the array.
   */
  const checkRole = (role, roles) => {
	const hasPermission = roles.includes(role);
  
	if (!hasPermission) {
	  throw ServiceError.forbidden('You are not allowed to view this part of the application');
	}
  };

module.exports = {
	getAll,
	getById,
	register,
	deleteById,
	checkAndParseSession,
	checkRole,
	login
};
