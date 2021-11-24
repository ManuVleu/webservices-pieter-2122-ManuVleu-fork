const uuid = require('uuid');
const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

const SELECT_COLUMNS = [
  `gebruikersID`,`${tables.gebruikers}.naam as gebruikersnaam`,
  'statsIDMeestVoltooid','meesteGeldOoit','meestWinstStockmarketOoit','geld',
];

const formatStats = ({ gebruiker_id,gebruiker_naam, ...rest }) => ({
	...rest,
	gebruiker: {
		id: gebruiker_id,
		naam: gebruiker_naam,
	},
});

/**
 * Find a stats van een gebruiker met id `gebruikersID`.
 *
 * @param {string} gebruikersID - Id of the gebruiker van de stats.
 */
const findById = async (gebruikersID) => {
  const stats = await getKnex()(tables.stats)
    .first(SELECT_COLUMNS)
    .where(`${tables.gebruikers}.id`,gebruikersID)
    .join(tables.gebruikers, `${tables.stats}.gebruikersID`, '=', `${tables.gebruikers}.id`)
  
  return stats && formatStats(stats);
};

/**
 * Create a new stats.
 *
 * @param {object} stats - The stats to create.
 * @param {string} stats.gebruikersID - De id van de gebruiker van de stats.
 *
 * @returns {Promise<object>} Created stats
 */
const create = async ({
  gebruikersID,
}) => {
  try {
    const gewoonteIDMeestVoltooid = "";
    const meesteGeldOoit = 0;
    const meestWinstStockmarketOoit = 0;
    const geld = 0;
    await getKnex()(tables.stats)
      .insert({
        gebruikersID,
        gewoonteIDMeestVoltooid,
        meesteGeldOoit,
        meestWinstStockmarketOoit,
        geld,
      });
    return await findById(gebruikersID);
  } catch (error) {
    const logger = getChildLogger('stats-repo');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
};

/**
 * Update an existing stats.
 *
 * @param {object} stats - The stats to create.
 * @param {string} stats.gebruikersID - De id van de gebruiker van de stats.
 * @param {string} stats.gewoonteIDMeestVoltooid - De ID van de gewoonte die het meest is uitgevoerd. Op basis van AantalKeerVoltooid van de gewoonte.
 * @param {number} stats.meesteGeldOoit - De grootste hoeveelheid geld je ooit hebt behaald. Op basis van geld.
 * @param {string} stats.meestWinstStockmarketOoit - Meest geld gewonnen in 1 dag door de stockmarket.
 * @param {string} stats.geld - Huidige hoeveelheid geld van de gebruiker.
 *
 * @returns {Promise<object>} Updated stats
 */
const updateById = async (gebruikersID, {
    gewoonteIDMeestVoltooid,
    meesteGeldOoit,
    meestWinstStockmarketOoit,
    geld,
}) => {
  try {
    await getKnex()(tables.stats)
      .update({
        gewoonteIDMeestVoltooid,
        meesteGeldOoit,
        meestWinstStockmarketOoit,
        geld,
      })
    .where(`${tables.gebruikers}.id`,gebruikersID);
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('stats-repo');
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
};

/**
 * Delete a stats with the given `id`.
 *
 * @param {string} gebruikersID - Id of the gebruiker van de stats to delete.
 *
 * @returns {Promise<boolean>} Whether the stats was deleted.
 */
const deleteById = async (gebruikersID) => {
  try {
    const rowsAffected = await getKnex()(tables.stats)
      .delete()
      .where(`${tables.gebruikers}.id`,gebruikersID);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('stats-repo');
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
};

module.exports = {
  findById,
  create,
  updateById,
  deleteById,
};
