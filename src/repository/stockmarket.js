const uuid = require('uuid');
const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

const SELECT_COLUMNS = [
  `gebruikersID`,
  'geldBedrijfA','geldBedrijfB','geldBedrijfC',
];

const formatStockmarket = ({ ...rest }) => ({
	...rest,
});


/**
 * Get all `limit` stockmarket, throws on error.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of stockmarket to return.
 * @param {number} pagination.offset - Nr of stockmarket to skip.
 */
 const findAll = async ({
  limit,
  offset,
}) => {
  const stockmarket = await getKnex()(tables.stockmarket)
    .select(SELECT_COLUMNS)
    .limit(limit)
    .offset(offset)
    .orderBy('gebruikersID', 'ASC');

  return stockmarket.map(formatStockmarket);
};

/**
 * Calculate the total number of stockmarket.
 * 
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.stockmarket)
    .count();

  return count['count(*)'];
};

/**
 * Find a stockmarket van een gebruiker met id `gebruikersID`.
 *
 * @param {string} gebruikersID - Id of the gebruiker van de stockmarket.
 */
const findById = async (gebruikersID) => {
  const stockmarket = await getKnex()(tables.stockmarket)
    .first(SELECT_COLUMNS)
    .where(`${tables.gebruikers}.id`,gebruikersID)
    .join(tables.gebruikers, `${tables.stockmarket}.gebruikersID`, '=', `${tables.gebruikers}.id`)
  
  return stockmarket && formatStockmarket(stockmarket);
};

/**
 * Create a new stockmarket.
 *
 * @param {object} stockmarket - The stockmarket to create.
 * @param {string} stockmarket.gebruikersID - De id van de gebruiker van de stockmarket.
 *
 * @returns {Promise<object>} Created stockmarket
 */
const create = async ({
  gebruikersID,
}) => {
  try {
    const [geldBedrijfA,geldBedrijfB,geldBedrijfC] = [0,0,0];
    await getKnex()(tables.stockmarket)
      .insert({
        gebruikersID,
        geldBedrijfA,
        geldBedrijfB,
        geldBedrijfC,
      });
    return await findById(gebruikersID);
  } catch (error) {
    const logger = getChildLogger('stockmarket-repo');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
};

/**
 * Update an existing stockmarket.
 *
 * @param {object} stockmarket - The stockmarket to create.
 * @param {string} stockmarket.gebruikersID - De id van de gebruiker van de stockmarket.
 * @param {number} stockmarket.geldBedrijfA - Hoeveelheid geld in bedrijfA.
 * @param {number} stockmarket.geldBedrijfB - Hoeveelheid geld in bedrijfB.
 * @param {number} stockmarket.geldBedrijfC - Hoeveelheid geld in bedrijfC.
 *
 * @returns {Promise<object>} Updated stockmarket
 */
const updateById = async (gebruikersID, {
    geldBedrijfA,
    geldBedrijfB,
    geldBedrijfC,
}) => {
  try {
    await getKnex()(tables.stockmarket)
      .update({
        geldBedrijfA,
        geldBedrijfB,
        geldBedrijfC,
      })
    .where(`gebruikersID`,gebruikersID);
    return await findById(gebruikersID);
  } catch (error) {
    const logger = getChildLogger('stockmarket-repo');
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
};

/**
 * Delete a stockmarket with the given `id`.
 *
 * @param {string} gebruikersID - Id of the gebruiker van de stockmarket to delete.
 *
 * @returns {Promise<boolean>} Whether the stockmarket was deleted.
 */
const deleteById = async (gebruikersID) => {
  try {
    const rowsAffected = await getKnex()(tables.stockmarket)
      .delete()
      .where(`gebruikersID`,gebruikersID);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('stockmarket-repo');
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
