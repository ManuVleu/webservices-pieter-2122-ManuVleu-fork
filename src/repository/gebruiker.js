const uuid = require('uuid');
const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

const SELECT_COLUMNS = [
  'id','naam'
];

const formatGebruiker = ({ ...rest }) => ({
	...rest,
});

/**
 * Get all `limit` gebruikers, skip the first `offset`.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of gebruikers to return.
 * @param {number} pagination.offset - Nr of gebruikers to skip.
 */
const findAll = async ({
  limit,
  offset,
}) => {
  return getKnex()(tables.gebruikers)
    .select()
    .limit(limit)
    .offset(offset)
    .orderBy('naam', 'ASC');
};

/**
 * Calculate the total number of gebruiker.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.gebruikers)
    .count();
  return count['count(*)'];
};

/**
 * Find a gebruiker with the given id.
 *
 * @param {string} id - The id van gebuiker to search for.
 */
const findById = async (id) => {
  return getKnex()(tables.gebruikers)
    .where('id', id)
    .first();
};

/**
 * Create a new gebruiker with the given `naam`.
 *
 * @param {object} gebruiker - gebruiker to create.
 * @param {string} gebruiker.naam - naam of the gebruiker.
 */
const create = async ({
  naam,
}) => {
  try {
    const id = uuid.v4();
    await getKnex()(tables.gebruikers)
      .insert({
        id,
        naam,
        //wachtwoord later
      });
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('gebruikers-repo');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
};

/**
 * Update a gebruiker with the given `id`.
 *
 * @param {string} id - Id of the gebruiker to update.
 * @param {object} gebruiker - gebruiker to save.
 * @param {string} gebruiker.naam - naam of the gebruiker.
 */
const updateById = async (id, {
  naam,
}) => {
  try {
    await getKnex()(tables.gebruikers)
      .update({
        naam,
      })
      .where('id', id);
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('gebruikers-repo');
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
};

/**
 * Update a gebruiker with the given `id`.
 *
 * @param {string} id - Id of the gebruiker to delete.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.gebruikers)
      .delete()
      .where('id', id);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('gebruikers-repo');
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
