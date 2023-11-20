const moneyFlowDao = require('../models/moneyFlowDao');
const error = require('../utils/error');

const getUsedMoneyFlowsByYearMonthAndGetSum = async (userId, year, month) => {
  let flowTypeId = 2;
  const flows = await moneyFlowDao.getUsedOrGotMoneyFlowsByUserIdByYearMonth(userId, flowTypeId, year, month);
  return await flows.reduce((acc, flow) => acc + flow.amount, 0);
}

module.exports = {
  getUsedMoneyFlowsByYearMonthAndGetSum
}