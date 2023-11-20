const fixedMoneyFlowDao = require('../models/fixedMoneyFlowDao');
const error = require('../utils/error');

const getUsedFixedMoneyFlowsByYearMonthAndGetAmount = async (userId, year, month) => { // 월 별
  let typeId = 2;
  const flows = await fixedMoneyFlowDao.getFixedMoneyFlowsByYearMonth(userId, typeId, year, month);
  const mapped = await Promise.all(flows.map( async (flow) => ({
      amount: flow.amount,
    }
  )));
  return mapped.reduce((acc, allowance) => acc + allowance.amount, 0);
}

module.exports = {
  getUsedFixedMoneyFlowsByYearMonthAndGetAmount
}