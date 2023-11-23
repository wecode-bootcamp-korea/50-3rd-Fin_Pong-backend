const fixedMoneyFlowDao = require('../models/fixedMoneyFlowDao');
const categoryService = require('../services/categoryService');
const userService = require('../services/userService')
const flowTypeService = require('../services/flowTypeService');
const error = require('../utils/error');
const { appDataSource } = require('../utils/dataSource');

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
          }
          else if (integerStartYear < k < integerEndYear) {
            for (let l = 1; l <= 12; l++) {
              result.push(await fixedMoneyFlowDao.postFixedMoneyFlow(userId, typeId, categoryId, memo, amount, k, l, integerStartDate, transaction));
            }
          }
          else if (k === integerEndYear) {
            for (let n = 1; n <= integerEndMonth; n++) {
              result.push(await fixedMoneyFlowDao.postFixedMoneyFlow(userId, typeId, categoryId, memo, amount, k, n, integerStartDate, transaction));
            }
          }
        }
      }

      else if (integerEndYear === integerStartYear) {
        if (endMonth > integerStartMonth) {
          for (let m = integerStartMonth; m <= integerEndMonth; m++) {
            result.push(await fixedMoneyFlowDao.postFixedMoneyFlow(userId, typeId, categoryId, memo, amount, integerStartYear, m, integerStartDate, transaction));
          }
        }
        else {
          error.throwErr(400, '마감월은 시작월보다 뒤여야 합니다');
        }
      }

      else if (integerEndYear < integerStartYear) {
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

const getFixedMoneyFlowsByYearMonth = async (userId, year, month) => { // 월 별 고정 수입/지출 data 여러 개
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

const getUsedFixedMoneyFlowsByYearMonthAndGetAmount = async (userId, year, month) => { // 월 별 고정 지출 사용량을 합산합니다.
  let typeId = 2;
  const flows = await fixedMoneyFlowDao.getUsedOrGotFixedMoneyFlowsByYearMonth(userId, typeId, year, month);
  const mapped = await Promise.all(flows.map( async (flow) => ({
      amount: flow.amount,
    }
  )));
  return mapped.reduce((acc, allowance) => acc + allowance.amount, 0);
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

const getGroupIdByFlowId = async (fixedFlowId) => { // 고정 수입/지출 내역이 속한 group 의 id를 찾습니다.
  const groupId = await fixedMoneyFlowDao.getGroupIdsByFlowId(fixedFlowId);
  if (!await groupId.length) {
    error.throwErr(404, 'NOT_EXISTING');
  }
  return await groupId[0]['groupId'];
}

const getFlowIdsByGroupId = async (groupId) => { // group 내에 속해 있는 모든 고정 수입/지출 내역의 id를 찾습니다.
  const fixedFlowIdsObj = await fixedMoneyFlowDao.getFlowIdsByGroupId(groupId);
  return Promise.all(fixedFlowIdsObj.map(fixedFlowObj => fixedFlowObj.flowId));
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

const deleteFixedMoneyFlows = async (flowIds, groupId, year, month, date) => { // 고정 수입/지출 내역 삭제 대상을 찾고, 같은 조건으로 연관 데이터들의 삭제를 조건에 따라 진행합니다.
  try {
    await appDataSource.transaction(async (transaction) => {

      const deletedIds = await Promise.all(flowIds.map(async (flowId) => { // 삭제 대상 고정 수입/지출 내역 ids 의 배열을 찾습니다.
        const flowIdObj = await fixedMoneyFlowDao.selectDeletedFixedMoneyFlowsByDate(flowId, year, month, date, transaction);
        return flowIdObj.id;
      }));

      const sortedEveryFlowIdsOfGroup = flowIds.slice().sort(); // 그룹 내 전체 fixedFlowId를 정렬합니다.
      const sortedDeletedIdsOfGroup = deletedIds.slice().sort(); // 그룹 내 삭제 대상 fixedFlowId를 정렬합니다.

      const areArraysEqual = JSON.stringify(sortedEveryFlowIdsOfGroup) === JSON.stringify(sortedDeletedIdsOfGroup); // 두 배열을 비교합니다(n log n). 이 때, 삭제 대상이 그룹 내 전체 고정 수입/지출 내역이면 해당 group 의 data 도 삭제합니다. (조건 1)

      await transaction.query('SET foreign_key_checks = 0');
      await Promise.all(flowIds.map(async (flowId) => { // 삭제 대상 고정 수입/지출 내역을 삭제합니다.
        await fixedMoneyFlowDao.deleteFixedMoneyFlowsByDate(flowId, year, month, date, transaction);
      }));

      await Promise.all(deletedIds.map(async (ids) => { // 삭제 대상 고정 수입/지출 내역과, 해당 그룹의 중간 테이블의 데이터를 삭제합니다.
        await fixedMoneyFlowDao.deleteMiddleFixedFlowsByIds(ids, groupId, transaction);
      }));

      if (areArraysEqual) {
        await fixedMoneyFlowDao.deleteFixedMoneyFlowsGroupById(groupId, transaction); // 삭제 대상이 그룹 내 전체 fixedFlows 면, group 의 data 도 삭제합니다.
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
  getUsedFixedMoneyFlowsByYearMonthAndGetAmount,
  getFixedMoneyFlowsByYearDate,
  getFixedMoneyFlowsByYearMonthDate,
  getGroupIdByFlowId,
  getFlowIdsByGroupId,
  updateFixedMoneyFlows,
  deleteFixedMoneyFlows
}