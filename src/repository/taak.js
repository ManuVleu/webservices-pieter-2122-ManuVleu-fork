const uuid = require('uuid');
const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

const SELECT_COLUMNS = [
  'taakID',`gebruikersID`,`${tables.gebruikers}.naam as gebruikersnaam`,
  `${tables.taken}.naam as taakNaam`,
  `startDatum`,'eindDatum',`geldBijVoltooiing`,
];

const formatTaak = ({ gebruiker_id,gebruiker_naam, ...rest }) => ({
	...rest,
	gebruiker: {
		id: gebruiker_id,
		naam: gebruiker_naam,
	},
});


/**
 * Get all `limit` taken van gegeven gebruiker, throws on error.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of taken to return.
 * @param {string} gebruikersID - De id van de gebruiker van de taken.
 * @param {number} pagination.offset - Nr of taken to skip.
 */
const findAll = async ({
  limit,
  offset,
  gebruikersID,
}) => {
  const taken = await getKnex()(tables.taken)
    .select(SELECT_COLUMNS)
    .where(`${tables.taken}.gebruikersID`,gebruikersID)
    .join(tables.gebruikers, `${tables.taken}.gebruikersID`, '=', `${tables.gebruikers}.id`)
    .limit(limit)
    .offset(offset)
    .orderBy('startDatum', 'ASC');

  return taken.map(formatTaak);
};

/**
 * Calculate the total number of taken per gebruiker.
 * @param {string} gebruikersID - De id van de gebruiker van de taken.
 * 
 */
const findCount = async (gebruikersID) => {
  const [count] = await getKnex()(tables.taken)
  .where(`${tables.taken}.gebruikersID`,gebruikersID)
    .count();

  return count['count(*)'];
};

/**
 * Find a taak van een gebruiker met id `gebruikersID` with the given `taakID` .
 *
 * @param {string} gebruikersID - Id of the gebruiker van de taken.
 * @param {string} taakID - Id of the taak to find.
 */
const findById = async (gebruikersID,taakID) => {
  const taak = await getKnex()(tables.taken)
    .first(SELECT_COLUMNS)
    .where(`${tables.taken}.taakID`, taakID)
    .andWhere(`${tables.gebruikers}.id`,gebruikersID)
    .join(tables.gebruikers, `${tables.taken}.gebruikersID`, '=', `${tables.gebruikers}.id`)
  
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
  gebruikersID,
  naam,
  eindDatum,
  geldBijVoltooiing,
}) => {
  try {
    const id = uuid.v4();
    const today = new Date();
    const startDatum = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    await getKnex()(tables.taken)
      .insert({
        id,
        gebruikersID,
        naam,
        startDatum,
        eindDatum,
        geldBijVoltooiing,
      });
    return await findById(gebruikersID,id);
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
 * @param {string} taak.naam - Naam van de taak.
 * @param {number} taak.geldBijVoltooiing - Hoeveelheid geld je krijgt als je de taak voltooid.
 * @param {Date} taak.eindDatum - De datum tot wanneer je tijd hebt om de taak te voltooien.
 *
 * @returns {Promise<object>} Updated taak
 */
const updateById = async (gebruikersID,id, {
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
      .where(`${tables.taken}.taakID`, taakID)
    .andWhere(`${tables.gebruikers}.id`,gebruikersID);
    return await findById(id);
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
 * @param {string} gebruikersID - Id of the gebruiker van de taak to delete.
 *
 * @returns {Promise<boolean>} Whether the taak was deleted.
 */
const deleteById = async (gebruikersID,id) => {
  try {
    const rowsAffected = await getKnex()(tables.taken)
      .delete()
      .where(`${tables.taken}.id`, id)
      .andWhere(`${tables.gebruikers}.id`,gebruikersID);
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
