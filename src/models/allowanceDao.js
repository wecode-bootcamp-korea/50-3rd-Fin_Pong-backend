const { appDataSource } = require('../utils/dataSource');
const error = require('../utils/error');

const postAllowance = async (userId, amount, year, month) => {
  const result = await appDataSource.query(
    `
    INSERT IGNORE INTO allowances(user_id, amount, year, month) 
    VALUES(?,?,?,?)
    `,
    [userId, amount, year, month]
  )
  if (result.affectedRows === 0) {
    error.throwErr(500, 'ALLOWANCE_ALREADY_EXISTS');
  }
  return result;
}

const getAllowance = async (userId) => { // 최신 순
  return await appDataSource.query(
    `
    SELECT allowances.id, users.name as userName, allowances.amount, allowances.year, allowances.month 
    FROM allowances 
    JOIN users 
    ON allowances.user_id = users.id
    WHERE user_id = ?
    ORDER BY year DESC, month DESC
    `,
    [userId]
  )
}


const updateAllowances = async (userId, amount, year, month) => {
  return await appDataSource.query(
    `
    UPDATE allowances 
    SET amount = ?
    WHERE user_id = ? 
    AND year = ?
    AND month = ?
    `,
    [amount, userId, year, month]
  )
}

const getAllowanceByYearMonth = async (userId, year, month) => {
  return await appDataSource.query(
    `
    SELECT id, user_id, amount, year, month 
    FROM allowances 
    WHERE user_id = ? 
    AND year = ? 
    AND month = ?
    `,
    [userId, year, month]
  )
}

const deleteAllowance = async (userId, year, month) => {
  console.log(userId, year, month)
  const result = await appDataSource.query(
    `
    DELETE FROM allowances 
    WHERE user_id = ? 
    AND year = ? 
    AND month = ? 
    `,
    [userId, year, month]
  )
  if (result.affectedRows === 0) {
    error.throwErr(500, 'NOT_EXISTING_OR_DELETED_ALLOWANCE');
  }
  return result;
}

module.exports = {
  postAllowance,
  getAllowance,
  updateAllowances,
  getAllowanceByYearMonth,
  deleteAllowance
}