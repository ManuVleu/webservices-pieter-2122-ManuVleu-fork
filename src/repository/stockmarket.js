const uuid = require('uuid');
const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

const SELECT_COLUMNS = [
  `gebruikersID`,`${tables.gebruikers}.naam as gebruikersnaam`,
  'geldBedrijfA','geldBedrijfB','geldBedrijfC',
];

const formatStockmarket = ({ gebruiker_id,gebruiker_naam, ...rest }) => ({
	...rest,
	gebruiker: {
		id: gebruiker_id,
		naam: gebruiker_naam,
	},
});

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
  
  return stockmarket && formatstockmarket(stockmarket);
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
    const startBedrag = 0;
    await getKnex()(tables.stockmarket)
      .insert({
        gebruikersID,
        startBedrag,
        startBedrag,
        startBedrag,
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
    .where(`${tables.gebruikers}.id`,gebruikersID);
    return await findById(id);
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
      .where(`${tables.gebruikers}.id`,gebruikersID);
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
  findById,
  create,
  updateById,
  deleteById,
};
