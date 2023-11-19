const moneyFlowDao = require('../models/moneyFlowDao');
const userService = require('../services/userService');
const flowTypeService = require('../services/flowTypeService');
const categoryService = require('../services/categoryService');
const error = require('../utils/error');

const postMoneyFlow = async (userId, type, categoryId, memo, amount, year, month, date) => {
  let typeId = 1;
  switch (type) {
    case '수입':
      break;
    case '지출':
      typeId += 1;
      break;
    default:
      error.throwErr('NOT_FOUND_TYPE')
  }
  return await moneyFlowDao.postMoneyFlow(userId, typeId, categoryId, memo, amount, year, month, date);
}

const getMoneyFlowsByUserId = async (userId) => {
  const flows = await moneyFlowDao.getMoneyFlowsByUserId(userId);
  return await Promise.all(flows.map( async (flow) => ({
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
  )))
}

const getMoneyFlowsByUserIdByYear = async (userId, year) => {
  const flows = await moneyFlowDao.getMoneyFlowsByUserIdByYear(userId, year);
  return await Promise.all(flows.map( async (flow) => ({
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
  )))
}

const getMoneyFlowsByUserIdByYearMonth = async (userId, year, month) => {
  const flows = await moneyFlowDao.getMoneyFlowsByUserIdByYearMonth(userId, year, month);
  return await Promise.all(flows.map( async (flow) => ({
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
  )))
}

const getMoneyFlowsByYearMonthAndGetSum = async (userId, year, month) => {
  const flows = await moneyFlowDao.getMoneyFlowsByUserIdByYearMonth(userId, year, month);
  return await Promise.all(flows.reduce((acc, flow) => acc + flow.amount, 0));
}

const getMoneyFlowsByUserIdByYearDate = async (userId, year, date) => {
  const flows = await moneyFlowDao.getMoneyFlowsByUserIdByYearDate(userId, year, date);
  return await Promise.all(flows.map( async (flow) => ({
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
  )))
}

const getMoneyFlowsByUserIdByYearMonthDate = async (userId, year, month, date) => {
  const flows = await moneyFlowDao.getMoneyFlowsByUserIdByYearMonthDate(userId, year, month, date);
  return await Promise.all(flows.map( async (flow) => ({
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
  )))
}

const updateMoneyFlow = async (id, userId, type, categoryId, memo, amount, year, month, date) => {
  let typeId = 1;
  switch (type) {
    case '수입':
      break;
    case '지출':
      typeId += 1;
      break;
    default:
      error.throwErr('NOT_FOUND_TYPE')
  }
  return await moneyFlowDao.updateMoneyFlow(id, userId, typeId, categoryId, memo, amount, year, month, date);
}

const deleteMoneyFlow = async (id, userId) => {
  return await moneyFlowDao.deleteMoneyFlow(id, userId);
}

module.exports = {
  postMoneyFlow,
  getMoneyFlowsByUserId,
  getMoneyFlowsByUserIdByYear,
  getMoneyFlowsByUserIdByYearMonth,
  getMoneyFlowsByUserIdByYearDate,
  getMoneyFlowsByUserIdByYearMonthDate,
  getMoneyFlowsByYearMonthAndGetSum,
  updateMoneyFlow,
  deleteMoneyFlow
}