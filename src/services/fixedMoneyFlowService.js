const fixedMoneyFlowDao = require('../models/fixedMoneyFlowDao');
const categoryService = require('../services/categoryService');
const userService = require('../services/userService')
const flowTypeService = require('../services/flowTypeService');
const error = require('../utils/error');
const {appDataSource} = require('../utils/dataSource');
const {postMiddleFixedMoneyFlow} = require('../models/fixedMoneyFlowDao');

const postFixedMoneyFlows = async (userId, type, categoryId, memo, amount, startYear, startMonth, startDate, endYear, endMonth) => {
  try {
    const typeId = await flowTypeService.getIdByFlowStatus(type);
    await appDataSource.transaction(async (transaction) => {
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
              result.push(await fixedMoneyFlowDao.postFixedMoneyFlow(userId, typeId, categoryId, memo, amount, k, i, integerStartDate, transaction));
            }
          } else if (integerStartYear < k < integerEndYear) {
            for (let l = 1; l <= 12; l++) {
              result.push(await fixedMoneyFlowDao.postFixedMoneyFlow(userId, typeId, categoryId, memo, amount, k, l, integerStartDate, transaction));
            }
          }
          for (let n = 1; n <= integerEndMonth; n++) {
            result.push(await fixedMoneyFlowDao.postFixedMoneyFlow(userId, typeId, categoryId, memo, amount, k, n, integerStartDate, transaction));
          }
        }
      } else if (integerEndYear === integerStartYear) {
        if (endMonth > integerStartMonth) {
          for (let m = integerStartMonth; m <= integerEndMonth; m++) {
            result.push(await fixedMoneyFlowDao.postFixedMoneyFlow(userId, typeId, categoryId, memo, amount, integerStartYear, m, integerStartDate, transaction));
          }
        } else {
          error.throwErr(400, '마감월은 시작월보다 뒤여야 합니다');
        }
      } else if (integerEndYear < integerStartYear) {
        error.throwErr(400, '마감년도는 시작년도 이후여야 합니다');
      }
      const fixedMoneyFlowIds = result; // 결과값을 반환합니다. fixed_money_flows 에 POST 한 id 값들의 모음입니다.
      const groupId = await fixedMoneyFlowDao.postFixedMoneyFlowsGroup(transaction); // Dao 에서 만든 fixed_money_flows_group 의 insertId를 반환합니다.
      for (let i = 0; i < fixedMoneyFlowIds.length; i++) {
        await fixedMoneyFlowDao.postMiddleFixedMoneyFlow(fixedMoneyFlowIds[i], groupId, transaction);
      }
      return 'POST_SUCCESS';
    })
  } catch (err) {
    throw err;
  }
}

// const postFixedMoneyFlowsGroup = async () => {
//   return await fixedMoneyFlowDao.postFixedMoneyFlowsGroup(); // Dao 에서 만든 fixed_money_flows_group 의 insertId를 반환합니다.
// }

// const postMiddleFixedMoneyFlows = async (fixedMoneyFlowIds, fixedMoneyFlowsGroupId) => {
//   for (let i = 0; i < fixedMoneyFlowIds.length; i++) {
//     await fixedMoneyFlowDao.postMiddleFixedMoneyFlow(fixedMoneyFlowIds[i], fixedMoneyFlowsGroupId);
//   }
//   return "SUCCESS";
// }

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

const getFixedMoneyFlowsByYearMonth = async (userId, year, month) => { // 월 별
  const flows = await fixedMoneyFlowDao.getFixedMoneyFlowsByYearMonth(userId, year, month);
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

const getFixedMoneyFlowsByYearDate = async (userId, year, date) => { // 월 별
  const flows = await fixedMoneyFlowDao.getFixedMoneyFlowsByYearDate(userId, year, date);
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

const getFixedMoneyFlowsByYearMonthDate = async (userId, year, month, date) => { // 월 별
  const flows = await fixedMoneyFlowDao.getFixedMoneyFlowsByYearMonthDate(userId, year, month, date);
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

const getGroupIdByFlowId = async (fixedFlowId) => {
  const groupId = await fixedMoneyFlowDao.getGroupIdsByFlowId(fixedFlowId);
  if (!groupId.legnth) {
    error.throwErr(404, 'NOT_EXISTING')
  }
  console.log(groupId)
  return await groupId[0]['groupId'];
}

const getFlowIdsByGroupId = async (groupId) => {
  const fixedFlowIdsObj = await fixedMoneyFlowDao.getFlowIdsByGroupId(groupId);
  return await Promise.all(fixedFlowIdsObj.map( async fixedFlowObj => await fixedFlowObj.flowId));
}

const updateFixedMoneyFlows = async (flowIds, amount, type, category, memo) => {
  try {
    const categoryId = await categoryService.getIdByCategoryName(category);
    const typeId = await flowTypeService.getIdByFlowStatus(type);
    for (let i in flowIds) {
      await appDataSource.transaction(async (transaction) => {
        await fixedMoneyFlowDao.updateFixedMoneyFlows(flowIds[i], amount, typeId, categoryId, memo, transaction);
      })
    }
    return 'SUCCESS';
  } catch(err) {
    throw err;
  }
}

const deleteFixedMoneyFlows = async (flowIds, groupId, year, month, date) => {
  try {
    await appDataSource.transaction(async (transaction) => {
      let deletedIds = []
      console.log(flowIds)
      for (let index in flowIds) {
        const deleteTargetId = await fixedMoneyFlowDao.selectDeletedFixedMoneyFlowsByDate(flowIds[index], year, month, date, transaction);
        deletedIds.push(await deleteTargetId);
      }
      await transaction.query('SET foreign_key_checks = 0');
      for (let i in flowIds) {
        await fixedMoneyFlowDao.deleteFixedMoneyFlowsByDate(flowIds[i], year, month, date, transaction);
      }
      const deletedId = await Promise.all(deletedIds.map( async flowIdObj => await flowIdObj.id));
      for (let ids in deletedId) {
        await fixedMoneyFlowDao.deleteMiddleFixedFlowsByIds(deletedId[ids], groupId, transaction);
      }
      await transaction.query('SET foreign_key_checks = 1');
      return 'DELETE_SUCCESS';
    })
  } catch(err) {
    throw err;
  }
}

module.exports = {
  postFixedMoneyFlows,
  getFixedMoneyFlows,
  getFixedMoneyFlowsByYearMonth,
  getFixedMoneyFlowsByYearDate,
  getFixedMoneyFlowsByYearMonthDate,
  getGroupIdByFlowId,
  getFlowIdsByGroupId,
  updateFixedMoneyFlows,
  deleteFixedMoneyFlows
}