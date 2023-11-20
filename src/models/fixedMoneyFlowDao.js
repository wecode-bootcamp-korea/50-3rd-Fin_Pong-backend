const { appDataSource } = require('../utils/dataSource');
const error = require('../utils/error');

const getFixedMoneyFlowsByYearMonth = async (userId, typeId, year, month) => { // 월별
  return await appDataSource.query(
    `
    SELECT id, user_id, flow_type_id, category_id, memo, amount, year, month, date 
    FROM fixed_money_flows 
    WHERE user_id = ?
    AND flow_type_id = ?
    AND year = ? 
    AND month = ?
    ORDER BY date DESC, amount DESC, flow_type_id, category_id
    `,
    [userId, typeId, year, month]
  )
}

module.exports = {
  getFixedMoneyFlowsByYearMonth
}