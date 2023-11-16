const fixedMoneyFlowDao = require('../models/fixedMoneyFlowDao');
const categoryService = require('../services/categoryService');
const userService = require('../services/userService')
const flowTypeService = require('../services/flowTypeService')
const error = require('../utils/error');

const postFixedMoneyFlows = async (userId, type, categoryId, memo, amount, startYear, startMonth, startDate, endYear, endMonth) => {
  let typeId = 1;
  switch (type) {
    case '수입':
      break;
    case '지출':
      typeId += 1;
      break;
    default:
      console.log('어떤 값인지 파악이 되지 않습니다.');
  }
  const integerStartYear = parseInt(startYear);
  const integerStartMonth = parseInt(startMonth);
  const integerStartDate = parseInt(startDate);
  const integerEndYear = parseInt(endYear);
  const integerEndMonth = parseInt(endMonth);
  const result = []; // 결과값
  if (integerEndYear - integerStartYear > 0) {
    for (let k = integerStartYear; k <= integerEndYear; k++) {
      if (k === integerStartYear) {
        for (let i = integerStartMonth; i <= 12; i++) {
          result.push(await fixedMoneyFlowDao.postFixedMoneyFlow(userId, typeId, categoryId, memo, amount, k, i, integerStartDate));
        }
      }
      else if (integerStartYear < k < integerEndYear) {
        for (let l = 1; l <= 12; l++) {
          result.push(await fixedMoneyFlowDao.postFixedMoneyFlow(userId, typeId, categoryId, memo, amount, k, l, integerStartDate));
        }
      }
      for (let n = 1; n <= integerEndMonth; n++) {
        result.push(await fixedMoneyFlowDao.postFixedMoneyFlow(userId, typeId, categoryId, memo, amount, k, n, integerStartDate));
      }
    }
  }
  else if (integerEndYear === integerStartYear) {
    if (endMonth > integerStartMonth) {
      for (let m = integerStartMonth; m <= integerEndMonth; m++) {
        result.push(await fixedMoneyFlowDao.postFixedMoneyFlow(userId, typeId, categoryId, memo, amount, integerStartYear, m, integerStartDate));
      }
    }
    else {
      error.throwErr(400, '마감월은 시작월보다 뒤여야 합니다');
    }
  }
  else if (integerEndYear < integerStartYear) {
    error.throwErr(400, '마감년도는 시작년도 이후여야 합니다');
  }
  return result; // 결과값을 반환합니다. fixed_money_flows 에 POST 한 id 값들의 모음입니다.
}

const postFixedMoneyFlowsGroup = async () => {
  return await fixedMoneyFlowDao.postFixedMoneyFlowsGroup(); // Dao 에서 만든 fixed_money_flows_group 의 insertId를 반환합니다.
}

const postMiddleFixedMoneyFlows = async (fixedMoneyFlowIds, fixedMoneyFlowsGroupId) => {
  for (let i = 0; i < fixedMoneyFlowIds.length; i++) {
    await fixedMoneyFlowDao.postMiddleFixedMoneyFlow(fixedMoneyFlowIds[i], fixedMoneyFlowsGroupId);
  }
  return "SUCCESS";
}

const getFixedMoneyFlows = async (userId) => {
  const flows = await fixedMoneyFlowDao.getFixedMoneyFlows(userId);
  const mapped = await Promise.all(flows.map( async (flow) => ({
      id: flow.id,
      userName: await userService.getNameById(flow.user_id),
      flowType: await flowTypeService.getFlowStatusById(flow.flow_type_id),
      category: await categoryService.getNameById(flow.category_id),
      memo: flow.memo,
      amount: flow.amount,
      year: flow.year,
      month: flow.month,
      date: flow.date,
    }
)));
  return mapped;
}

module.exports = {
  postFixedMoneyFlows,
  postFixedMoneyFlowsGroup,
  postMiddleFixedMoneyFlows,
  getFixedMoneyFlows
}