const uuid = require('uuid');
const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

const SELECT_COLUMNS = [
  'gewoonteID',`gebruikersID`,
  `${tables.gewoontes}.naam as gewoonteNaam`,
  `startDatum`,'aantalKeerVoltooid','laatsteKeerVoltooid','soortHerhaling',
  `geldBijVoltooiing`,
];

const formatGewoonte = ({ ...rest }) => ({
	...rest,
});


/**
 * Get all `limit` gewoontes, throws on error.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of gewoontes to return.
 * @param {number} pagination.offset - Nr of gewoontes to skip.
 */
const findAll = async ({
  limit,
  offset,
}) => {
  const gewoontes = await getKnex()(tables.gewoontes)
    .select(SELECT_COLUMNS)
    .limit(limit)
    .offset(offset)
    .orderBy('naam', 'ASC');

  return gewoontes.map(formatGewoonte);
};

/**
 * Calculate the total number of gewoontes per gebruiker.
 * 
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.gewoontes)
    .count();

  return count['count(*)'];
};

/**
 * Find a gewoonte with the given `gewoonteID` .
 *
 * @param {string} gewoonteID - Id of the gewoonte to find.
 */
const findById = async (gewoonteID) => {
  const gewoonte = await getKnex()(tables.gewoontes)
    .first(SELECT_COLUMNS)
    .where(`${tables.gewoontes}.gewoonteID`, gewoonteID)

    if(!gewoonte){
      return 'Error: Gewoonte met gegeven ID bestaat niet.';
    }
  
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
    const gewoonteID = uuid.v4();
    const today = new Date();
    const startDatum = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const aantalKeerVoltooid = 0;
    const laatsteKeerVoltooid = startDatum;
    await getKnex()(tables.gewoontes)
      .insert({
        gewoonteID,
        gebruikersID,
        naam,
        startDatum,
        geldBijVoltooiing, 
        aantalKeerVoltooid,
        laatsteKeerVoltooid,
        soortHerhaling,
      });
    return await findById(gewoonteID);
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
 * @param {string} gewoonte.gewoonteID - De id van de gewoonte.
 * @param {string} gewoonte.naam - Naam van de gewoonte.
 * @param {string} gewoonte.soortHerhaling - Soort van gewoonte, kan alleen 'Dagelijks','Wekelijks' of 'Maandelijks' zijn.
 * @param {number} gewoonte.geldBijVoltooiing - geld die de gewoonte opbrengt als je het voltooid.
 * @param {number} gewoonte.aantalKeerVoltooid - Aantal keer gewoonte is voltooid.
 * @param {date} gewoonte.laatsteKeerVoltooid - Datum wanneer gewoonte laatste keer is voltooid.
 *
 * @returns {Promise<object>} Updated gewoonte
 */
const updateById = async (gewoonteID, {
  naam,
  geldBijVoltooiing,
  soortHerhaling,
  aantalKeerVoltooid,
  laatsteKeerVoltooid
}) => {
  try {
    await getKnex()(tables.gewoontes)
      .update({
        naam,
        geldBijVoltooiing,
        soortHerhaling,
        aantalKeerVoltooid,
        laatsteKeerVoltooid
      })
      .where(`${tables.gewoontes}.gewoonteID`, gewoonteID)
    return await findById(gewoonteID);
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
 *
 * @returns {Promise<boolean>} Whether the gewoonte was deleted.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.gewoontes)
      .delete()
      .where(`${tables.gewoontes}.gewoonteID`, id)
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
