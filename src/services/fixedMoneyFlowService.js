const fixedMoneyFlowDao = require('../models/fixedMoneyFlowDao');
const error = require('../utils/error');



// const getFixedMoneyFlowsByYearMonth = async (userId, year, month) => { // 월 별
//   const flows = await fixedMoneyFlowDao.getFixedMoneyFlowsByYearMonth(userId, year, month);
//   const mapped = await Promise.all(flows.map( async (flow) => ({
//       id: flow.id,
//       userName: await userService.getNameById(flow.user_id),
//       flowType: await flowTypeService.getFlowStatusById(flow.flow_type_id),
//       category: await categoryService.getNameById(flow.category_id),
//       memo: flow.memo,
//       amount: flow.amount,
//       year: flow.year,
//       month: flow.month,
//       date: flow.date,
//     }
//   )));
//   return mapped;
// }

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