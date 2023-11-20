const moneyFlowDao = require('../models/moneyFlowDao');
const userService = require('../services/userService');
const flowTypeService = require('../services/flowTypeService');
const categoryService = require('../services/categoryService');
const error = require('../utils/error');

const postMoneyFlow = async (userId, type, categoryId, memo, amount, year, month, date) => {
  const typeId = await flowTypeService.getIdByFlowStatus(type);
  if (!typeId) {
    error.throwErr(404, 'NOT_EXISTING_TYPE');
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

const getMoneyFlowsByFamilyUserId = async (familyUserIds) => {
  let familyUserFlows = [];
  for (let i in familyUserIds) {
    const flows = await moneyFlowDao.getMoneyFlowsByUserId(familyUserIds[i]);
    familyUserFlows = familyUserFlows.concat(await Promise.all(flows.map(async (flow) => {
      return {
        id: flow.id,
        userName: await userService.getNameById(flow.user_id),
        flowType: await flowTypeService.getFlowStatusById(flow.flow_type_id),
        category: await categoryService.getNameById(flow.category_id),
        memo: flow.memo,
        amount: flow.amount,
        year: flow.year,
        month: flow.month,
        date: flow.date,
      };
    })));
  }
  console.log(familyUserFlows)
  return familyUserFlows;
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

const getMoneyFlowsByFamilyUserIdByYear = async (familyUserIds, year) => {
  let familyUserFlows = [];
  for (let i in familyUserIds) {
    const flows = await moneyFlowDao.getMoneyFlowsByUserIdByYear(familyUserIds[i], year);
    familyUserFlows = familyUserFlows.concat(await Promise.all(flows.map(async (flow) => {
      return {
        id: flow.id,
        userName: await userService.getNameById(flow.user_id),
        flowType: await flowTypeService.getFlowStatusById(flow.flow_type_id),
        category: await categoryService.getNameById(flow.category_id),
        memo: flow.memo,
        amount: flow.amount,
        year: flow.year,
        month: flow.month,
        date: flow.date,
      };
    })));
  }
  return familyUserFlows;
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

const getMoneyFlowsByFamilyUserIdByYearMonth = async (familyUserIds, year, month) => {
  let familyUserFlows = [];
  for (let i in familyUserIds) {
    const flows = await moneyFlowDao.getMoneyFlowsByUserIdByYearMonth(familyUserIds[i], year, month);
    familyUserFlows = familyUserFlows.concat(await Promise.all(flows.map(async (flow) => {
      return {
        id: flow.id,
        userName: await userService.getNameById(flow.user_id),
        flowType: await flowTypeService.getFlowStatusById(flow.flow_type_id),
        category: await categoryService.getNameById(flow.category_id),
        memo: flow.memo,
        amount: flow.amount,
        year: flow.year,
        month: flow.month,
        date: flow.date,
      };
    })));
  }
  return familyUserFlows;
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

const getMoneyFlowsByFamilyUserIdByYearDate = async (familyUserIds, year, date) => {
  let familyUserFlows = [];
  for (let i in familyUserIds) {
    const flows = await moneyFlowDao.getMoneyFlowsByUserIdByYearDate(familyUserIds[i], year, date);
    familyUserFlows = familyUserFlows.concat(await Promise.all(flows.map(async (flow) => {
      return {
        id: flow.id,
        userName: await userService.getNameById(flow.user_id),
        flowType: await flowTypeService.getFlowStatusById(flow.flow_type_id),
        category: await categoryService.getNameById(flow.category_id),
        memo: flow.memo,
        amount: flow.amount,
        year: flow.year,
        month: flow.month,
        date: flow.date,
      };
    })));
  }
  return familyUserFlows;
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

const getMoneyFlowsByFamilyUserIdByYearMonthDate = async (familyUserIds, year, month, date) => {
  let familyUserFlows = [];
  for (let i in familyUserIds) {
    const flows = await moneyFlowDao.getMoneyFlowsByUserIdByYearMonthDate(familyUserIds[i], year, month, date);
    familyUserFlows = familyUserFlows.concat(await Promise.all(flows.map(async (flow) => {
      return {
        id: flow.id,
        userName: await userService.getNameById(flow.user_id),
        flowType: await flowTypeService.getFlowStatusById(flow.flow_type_id),
        category: await categoryService.getNameById(flow.category_id),
        memo: flow.memo,
        amount: flow.amount,
        year: flow.year,
        month: flow.month,
        date: flow.date,
      };
    })));
  }
  return familyUserFlows;
}

const updateMoneyFlow = async (id, userId, type, categoryId, memo, amount, year, month, date) => {
  const typeId = await flowTypeService.getFlowStatusById(type);
  if (!typeId) {
    error.throwErr(404, 'NOT_EXISTING_TYPE');
  }
  return await moneyFlowDao.updateMoneyFlow(id, userId, typeId, categoryId, memo, amount, year, month, date);
}

const deleteMoneyFlow = async (id, userId) => {
  return await moneyFlowDao.deleteMoneyFlow(id, userId);
}

module.exports = {
  postMoneyFlow,
  getMoneyFlowsByUserId,
  getMoneyFlowsByFamilyUserId,
  getMoneyFlowsByUserIdByYear,
  getMoneyFlowsByFamilyUserIdByYear,
  getMoneyFlowsByUserIdByYearMonth,
  getMoneyFlowsByFamilyUserIdByYearMonth,
  getMoneyFlowsByUserIdByYearDate,
  getMoneyFlowsByFamilyUserIdByYearDate,
  getMoneyFlowsByUserIdByYearMonthDate,
  getMoneyFlowsByFamilyUserIdByYearMonthDate,
  updateMoneyFlow,
  deleteMoneyFlow
}