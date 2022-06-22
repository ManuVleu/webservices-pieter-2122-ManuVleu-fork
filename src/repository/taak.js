const uuid = require('uuid');
const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

const SELECT_COLUMNS = [
  'taakID','gebruikersID',
  `${tables.taken}.naam as taakNaam`,
  'startDatum','eindDatum','geldBijVoltooiing',
];

const formatTaak = ({ ...rest }) => ({
	...rest,
});


/**
 * Get all `limit` taken, throws on error.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of taken to return.
 * @param {number} pagination.offset - Nr of taken to skip.
 */
const findAll = async ({
  limit,
  offset,
}) => {
  const taken = await getKnex()(tables.taken)
    .select(SELECT_COLUMNS)
    .limit(limit)
    .offset(offset)
    .orderBy('naam', 'ASC');

  return taken.map(formatTaak);
};

/**
 * Calculate the total number of taken.
 * 
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.taken)
    .count();

  return count['count(*)'];
};

/**
 * Find a taak with the given `taakID`.
 *
 * @param {string} taakID - Id of the taak to find.
 */
const findById = async (taakID) => {
  const taak = await getKnex()(tables.taken)
    .first(SELECT_COLUMNS)
    .where(`${tables.taken}.taakID`, taakID);
  
  if(!taak)
    return 'Error: De taak met de gegeven taakID bestaat niet.';

  return taak && formatTaak(taak);
};

/**
 * Create a new taak.
 *
 * @param {object} taak - The taak to create.
 * @param {string} taak.gebruikersID - De id van de gebruiker voor de nieuwe taak.
 * @param {string} taak.naam - Naam van de taak.
 * @param {Date} taak.eindDatum - De datum tot wanneer je tijd hebt om de taak te voltooien.
 * @param {number} taak.geldBijVoltooiing - Hoeveelheid geld je krijgt als je de taak voltooid.
 *
 * @returns {Promise<object>} Created taak
 */
const create = async ({
  gebruikersID,naam, geldBijVoltooiing,eindDatum,
}) => {
  try {
    const taakID = uuid.v4();
    const today = new Date();
    const startDatum = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    await getKnex()(tables.taken)
      .insert({
        taakID,
        gebruikersID,
        naam,
        startDatum,
        geldBijVoltooiing,
        eindDatum,
      });
    return await findById(taakID);
  } catch (error) {
    const logger = getChildLogger('taken-repo');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
};

/**
 * Update an existing taak.
 *
 * @param {object} taak - The taak to create.
 * @param {string} taak.taakID - The id of the taak.
 * @param {string} taak.naam - Naam van de taak.
 * @param {number} taak.geldBijVoltooiing - Hoeveelheid geld je krijgt als je de taak voltooid.
 * @param {Date} taak.eindDatum - De datum tot wanneer je tijd hebt om de taak te voltooien.
 *
 * @returns {Promise<object>} Updated taak
 */
const updateById = async (taakID, {
  naam,
  geldBijVoltooiing,
  eindDatum,
}) => {
  try {
    await getKnex()(tables.taken)
      .update({
        naam,
        geldBijVoltooiing,
        eindDatum,
      })
      .where(`${tables.taken}.taakID`, taakID);
    return await findById(taakID);
  } catch (error) {
    const logger = getChildLogger('taken-repo');
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
};

/**
 * Delete a taak with the given `id`.
 *
 * @param {string} id - Id of the taak to delete.
 *
 * @returns {Promise<boolean>} Whether the taak was deleted.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.taken)
      .delete()
      .where(`${tables.taken}.taakID`, id);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('taken-repo');
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
};

module.exports = {
  findAll,
  findCount,
  findById,
  create,
  updateById,
  deleteById,
};
