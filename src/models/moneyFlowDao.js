const { appDataSource } = require('../utils/dataSource');
const error = require('../utils/error');

const getUsedOrGotMoneyFlowsByUserIdByYearMonth = async (userId, flowTypeId, year, month) => {
  return await appDataSource.query(
    `
    SELECT id, user_id, flow_type_id, category_id, memo, amount, year, month, date
    FROM money_flows 
    WHERE user_id = ? 
    AND flow_type_id = ?
    AND year = ?
    AND month = ?
    ORDER BY date desc, category_id, amount desc
    `,
    [userId, flowTypeId, year, month]
  )
}

module.exports = {
  getUsedOrGotMoneyFlowsByUserIdByYearMonth
}