const { appDataSource } = require('../utils/dataSource');
const error = require('../utils/error');

const getAllowanceByYearMonth = async (userId, year, month) => {
  return await appDataSource.query(
    `
    SELECT allowances.id, users.name as userName, allowances.amount, allowances.year, allowances.month 
    FROM allowances 
    JOIN users 
    ON allowances.user_id = users.id
    WHERE user_id = ? 
    AND allowances.year = ?
    AND allowances.month = ?
    `,
    [userId, year, month]
  )
}
module.exports = {
  getAllowanceByYearMonth
}