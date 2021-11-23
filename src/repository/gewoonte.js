const uuid = require('uuid');
const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

const SELECT_COLUMNS = [
  'gewoonteID',`gebruikersID`,`${tables.gebruikers}.naam as gebruikersnaam`,
  `${tables.gewoontes}.naam as gewoonteNaam`,
  `startDatum`,'aantalKeerVoltooid','laatsteKeerVoltooid','soortHerhaling',
  `geldBijVoltooiing`,
];

const formatGewoonte = ({ gebruiker_id,gebruiker_naam, ...rest }) => ({
	...rest,
	gebruiker: {
		id: gebruiker_id,
		naam: gebruiker_naam,
	},
});


/**
 * Get all `limit` gewoontes van gegeven gebruiker, throws on error.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of transactions to return.
 * @param {string} gebruikersID - De id van de gebruiker van de gewoontes.
 * @param {number} pagination.offset - Nr of transactions to skip.
 */
const findAll = async ({
  limit,
  offset,
  gebruikersID,
}) => {
  const gewoontes = await getKnex()(tables.gewoontes)
    .select(SELECT_COLUMNS)
    .where(`${tables.gewoontes}.gebruikersID`,gebruikersID)
    .join(tables.gebruikers, `${tables.gewoontes}.gebruikersID`, '=', `${tables.gebruikers}.id`)
    .limit(limit)
    .offset(offset)
    .orderBy('startDatum', 'ASC');

  return gewoontes.map(formatGewoonte);
};

/**
 * Calculate the total number of gewoontes per gebruiker.
 * @param {string} gebruikersID - De id van de gebruiker van de gewoontes.
 * 
 */
const findCount = async (gebruikersID) => {
  const [count] = await getKnex()(tables.gewoontes)
  .where(`${tables.gewoontes}.gebruikersID`,gebruikersID)
    .count();

  return count['count(*)'];
};

/**
 * Find a gewoonte van een gebruiker met id `gebruikersID` with the given `gewoonteID` .
 *
 * @param {string} gebruikersID - Id of the gebruiker van de gewoontes.
 * @param {string} gewoonteID - Id of the gewoonte to find.
 */
const findById = async (gebruikersID,gewoonteID) => {
  const gewoonte = await getKnex()(tables.gewoontes)
    .first(SELECT_COLUMNS)
    .where(`${tables.gewoontes}.gewoonteID`, gewoonteID)
    .andWhere(`${tables.gebruikers}.id`,gebruikersID)
    .join(tables.gebruikers, `${tables.gewoontes}.gebruikersID`, '=', `${tables.gebruikers}.id`)
  
  return gewoonte && formatGewoonte(gewoonte);
};

/**
 * Create a new gewoonte.
 *
 * @param {object} gewoonte - The gewoonte to create.
 * @param {string} gewoonte.gebruikersID - De id van de gebruiker voor de nieuwe gewoonte.
 * @param {string} gewoonte.naam - Naam van de gewoonte.
 * @param {number} gewoonte.geldBijVoltooiing - Hoeveelheid geld je krijgt als je de gewoonte voltooid.
 * @param {string} gewoonte.soortHerhaling - Hoeveel keer je de gewoonte doet. Kan alleen 'Dagelijks','Wekelijks' of 'Maandelijks' zijn.
 *
 * @returns {Promise<object>} Created gewoote
 */
const create = async ({
  gebruikersID,
  naam,
  geldBijVoltooiing,
  soortHerhaling,
}) => {
  try {
    const id = uuid.v4();
    const today = new Date();
    const startDatum = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const aantalKeerVoltooid = 0;
    const laatsteKeerVoltooid = startDatum;
    await getKnex()(tables.gewoontes)
      .insert({
        id,
        gebruikersID,
        naam,
        startDatum,
        geldBijVoltooiing,
        aantalKeerVoltooid,
        laatsteKeerVoltooid,
        soortHerhaling,
      });
    return await findById(gebruikersID,id);
  } catch (error) {
    const logger = getChildLogger('gewoontes-repo');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
};

/**
 * Update an existing gewoonte.
 *
 * @param {object} gewoonte - The gewoonte to create.
 * @param {string} gewoonte.gebruikersID - De id van de gebruiker van de gewoonte.
 * @param {string} gewoonte.id - De id van de gewoonte.
 * @param {string} gewoonte.naam - Naam van de gewoonte.
 * @param {number} gewoonte.geldBijVoltooiing - Hoeveelheid geld je krijgt als je de gewoonte voltooid.
 * @param {Date} gewoonte.startDatum - Datum vanaf wanneer de gewoonte weer min 1 keer moet uitgevoerd worden. Hangt dus vast aan soortHerhaling.
 *
 * @returns {Promise<object>} Updated gewoonte
 */
const updateById = async (gebruikersID,id, {
  naam,
  geldBijVoltooiing,
  startDatum
}) => {
  try {
    await getKnex()(tables.gewoontes)
      .update({
        naam,
        geldBijVoltooiing,
        startDatum
      })
      .where(`${tables.gewoontes}.gewoonteID`, gewoonteID)
    .andWhere(`${tables.gebruikers}.id`,gebruikersID);
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('gewoontes-repo');
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
};

/**
 * Delete a gewoonte with the given `id`.
 *
 * @param {string} id - Id of the gewoonte to delete.
 * @param {string} gebruikersID - Id of the gebruiker van de gewoonte to delete.
 *
 * @returns {Promise<boolean>} Whether the gewoonte was deleted.
 */
const deleteById = async (gebruikersID,id) => {
  try {
    const rowsAffected = await getKnex()(tables.gewoontes)
      .delete()
      .where(`${tables.gewoontes}.id`, id)
      .andWhere(`${tables.gebruikers}.id`,gebruikersID);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('gewoontes-repo');
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
