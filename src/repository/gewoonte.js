const uuid = require('uuid');
const { tables, getKnex } = require('../data/index');
const { getChildLogger } = require('../core/logging');

const SELECT_COLUMNS = [
  `${tables.gewoontes}.id`, 'amount', 'date',
  `${tables.place}.id as place_id`, `${tables.place}.name as place_name`,
  `${tables.user}.id as user_id`, `${tables.user}.name as user_name`,
];

const formatTransaction = ({ place_id, place_name, user_id, user_name, ...rest }) => ({
	...rest,
	place: {
		id: place_id,
		name: place_name,
	},
	user: {
		id: user_id,
		name: user_name,
	},
});


/**
 * Get all `limit` transactions, throws on error.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of transactions to return.
 * @param {number} pagination.offset - Nr of transactions to skip.
 */
const findAll = async ({
  limit,
  offset,
}) => {
  const transactions = await getKnex()(tables.transaction)
    .select(SELECT_COLUMNS)
    .join(tables.place, `${tables.transaction}.place_id`, '=', `${tables.place}.id`)
    .join(tables.user, `${tables.transaction}.user_id`, '=', `${tables.user}.id`)
    .limit(limit)
    .offset(offset)
    .orderBy('date', 'ASC');

  return transactions.map(formatTransaction);
};

/**
 * Calculate the total number of transactions.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.transaction)
    .count();

  return count['count(*)'];
};

/**
 * Find a transaction with the given `id`.
 *
 * @param {string} id - Id of the transaction to find.
 */
const findById = async (id) => {
  const transaction = await getKnex()(tables.transaction)
    .first(SELECT_COLUMNS)
    .where(`${tables.transaction}.id`, id)
    .join(tables.place, `${tables.transaction}.place_id`, '=', `${tables.place}.id`)
    .join(tables.user, `${tables.transaction}.user_id`, '=', `${tables.user}.id`);
  
  return transaction && formatTransaction(transaction);
};

/**
 * Create a new transaction.
 *
 * @param {object} transaction - The transaction to create.
 * @param {string} transaction.amount - Amount deposited/withdrawn.
 * @param {Date} transaction.date - Date of the transaction.
 * @param {string} transaction.placeId - Id of the place the transaction happened.
 * @param {string} transaction.userId - Id of the user who did the transaction.
 *
 * @returns {Promise<object>} Created transaction
 */
const create = async ({
  amount,
  date,
  placeId,
  userId,
}) => {
  try {
    const id = uuid.v4();
    await getKnex()(tables.transaction)
      .insert({
        id,
        amount,
        date,
        place_id: placeId,
        user_id: userId,
      });
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('transactions-repo');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
};

/**
 * Update an existing transaction.
 *
 * @param {string} id - Id of the transaction to update.
 * @param {object} transaction - The transaction data to save.
 * @param {string} [transaction.amount] - Amount deposited/withdrawn.
 * @param {Date} [transaction.date] - Date of the transaction.
 * @param {string} [transaction.placeId] - Id of the place the transaction happened.
 * @param {string} [transaction.userId] - Id of the user who did the transaction.
 *
 * @returns {Promise<object>} Updated transaction
 */
const updateById = async (id, {
  amount,
  date,
  placeId,
  userId,
}) => {
  try {
    await getKnex()(tables.transaction)
      .update({
        amount,
        date,
        place_id: placeId,
        user_id: userId,
      })
      .where(`${tables.transaction}.id`, id);
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('transactions-repo');
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
};

/**
 * Delete a transaction with the given `id`.
 *
 * @param {string} id - Id of the transaction to delete.
 *
 * @returns {Promise<boolean>} Whether the transaction was deleted.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.transaction)
      .delete()
      .where(`${tables.transaction}.id`, id);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('transactions-repo');
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
