const { appDataSource } = require('../utils/dataSource');
const error = require('../utils/error');

const postAllowance = async (userId, amount, year, month) => {
  const result = await appDataSource.query(
    `
    INSERT IGNORE INTO allowances(user_id, amount, year, month) 
    VALUES(?,?,?,?)
    `,
    [userId, amount, year, month],
  );
  if (result.affectedRows === 0) {
    error.throwErr(409, 'ALREADY_EXISTS');
  }
  return result;
};

const getAllowance = async (userId) => {
  // 최신 순
  return await appDataSource.query(
    `
    SELECT allowances.id, users.name as userName, allowances.amount as allowance, allowances.year, allowances.month 
    FROM allowances 
    JOIN users 
    ON allowances.user_id = users.id
    WHERE user_id = ?
    ORDER BY allowances.year DESC, allowances.month DESC
    `,
    [userId],
  );
};

const getAllowanceByYear = async (userId, year) => {
  // 최신 순
  return await appDataSource.query(
    `
    SELECT allowances.id, users.name as userName, allowances.amount as allowance as allowance, allowances.year, allowances.month 
    FROM allowances 
    JOIN users 
    ON allowances.user_id = users.id
    WHERE user_id = ? 
    AND allowances.year = ?
    ORDER BY allowances.month DESC
    `,
    [userId, year],
  );
};

const getAllowanceByYearMonth = async (userId, year, month) => {
  return await appDataSource.query(
    `
    SELECT allowances.id, users.name as userName, allowances.amount as allowance, allowances.year, allowances.month 
    FROM allowances 
    JOIN users 
    ON allowances.user_id = users.id
    WHERE user_id = ? 
    AND allowances.year = ?
    AND allowances.month = ?
    `,
    [userId, year, month],
  );
};

const updateAllowance = async (userId, amount, year, month) => {
  return await appDataSource.query(
    `
    UPDATE allowances 
    SET amount = ?
    WHERE user_id = ? 
    AND year = ?
    AND month = ?
    `,
    [amount, userId, year, month],
  );
};

const updateAllowanceById = async (allowanceId, amount, year, month) => {
  const result = await appDataSource.query(
    `
    UPDATE allowances 
    SET amount = ?, year = ?, month = ?
    WHERE id = ? 
    `,
    [amount, year, month, allowanceId],
  );
  if (result.affectedRows === 0) {
    error.throwErr(409, 'ALREADY_EXISTS');
  }
  return result;
};

const deleteAllowance = async (userId, year, month) => {
  const result = await appDataSource.query(
    `
    DELETE FROM allowances 
    WHERE user_id = ? 
    AND year = ? 
    AND month = ? 
    `,
    [userId, year, month],
  );
  if (result.affectedRows === 0) {
    error.throwErr(404, 'NOT_EXISTING_OR_DELETED_ALLOWANCE');
  }
  return result;
};

const deleteAllowanceById = async (allowanceId) => {
  const result = await appDataSource.query(
    `
    DELETE FROM allowances 
    WHERE id = ? 
    `,
    [allowanceId],
  );
  if (result.affectedRows === 0) {
    error.throwErr(404, 'NOT_EXISTING_OR_DELETED_ALLOWANCE');
  }
  return result;
};

const getMonthlyAllowancesByPrivate = async (userId, year) => {
  return await appDataSource.query(
    `
    SELECT
      user_id,
      month,
      amount AS income
    FROM allowances
    WHERE user_id = ? AND year = ?
    ORDER BY month ASC;
  `,
    [userId, year],
  );
};

module.exports = {
  postAllowance,
  getAllowance,
  getAllowanceByYear,
  getAllowanceByYearMonth,
  updateAllowance,
  updateAllowanceById,
  deleteAllowance,
  deleteAllowanceById,
  getMonthlyAllowancesByPrivate, // -홍영기 함수
};
