const moneyFlowDao = require('../models/moneyFlowDao');
const middleWare = require('../middlewares/index');
const userService = require('../services/userService');
const flowTypeService = require('../services/flowTypeService');
const categoryService = require('../services/categoryService');
const error = require('../utils/error');


const search = async( data ) => {
    const query1 = await middleWare.queryBuilder1( data )
    const result1 = await moneyFlowDao.getConditionalGeneralInfo( query1 )
    for (i=0; i<result1.length; i++){
      result1[i].fixed_status = 0
    }

    const query2 = await middleWare.queryBuilder2( data )
    const result2 = await moneyFlowDao.getConditionalFixedInfo ( query2 )
    for (i=0; i<result2.length; i++){
      result2[i].fixed_status = 1
    }
    
    let result = []
    if (data.dateOrder==='DESC'){
      result = result1.concat(result2).sort((a,b) => b.date - a.date)
    }else{
      result = result1.concat(result2).sort((a,b) => a.date - b.date)
    }
    return result
}

const yearlyView = async( userId, familyId, year) => {
  let monthlyIncome = []
  let monthlySpending1 = []
  let monthlySpending2 = []
  let monthlySpending = []
  if(familyId){
    monthlyIncome =  await moneyFlowDao.getMonthlyIncomeByFamily( familyId, year )
    monthlySpending1 = await moneyFlowDao.getMonthlyGeneralSpendingByFamily( familyId, year )
    monthlySpending2 = await moneyFlowDao.getMonthlyFixedSpendingByFamily( familyId, year )
    for (i=0; i<12; i++){
      if(!monthlySpending1[i]){
        monthlySpending1[i] = { family_id : monthlySpending1[0].family_id, month : i+1, spending : 0 }
      }
    }
    for (i=0; i<12; i++){
      if(!monthlySpending2[i]){
        monthlySpending2[i] = { family_id : monthlySpending2[0].family_id, month : i+1, spending : 0 }
      }
    }
    monthlySpending = monthlySpending1.map((item, index) => ({
      family_id: item.family_id,
      month: item.month,
      spending: (Number(item.spending) + Number(monthlySpending2[index].spending))
    }))
  }else if (userId){
    monthlyIncome =  await moneyFlowDao.getMonthlyIncomeByPrivate( userId, year )
    monthlySpending1 = await moneyFlowDao.getMonthlyGeneralSpendingByPrivate( userId, year )
    monthlySpending2 = await moneyFlowDao.getMonthlyFixedSpendingByPrivate( userId, year )
    for (i=0; i<12; i++){
      if(!monthlySpending1[i]){
        monthlySpending1[i] = { user_id : monthlySpending1[0].user_id, month : i+1, spending : 0 }
      }
    }
    if(monthlySpending2.length==0){
      for (i=0; i<monthlySpending1.length; i++){
        monthlySpending1[i].spending = Number(monthlySpending1[i].spending)
      }
      monthlySpending = monthlySpending1
    }else{
      for (i=0; i<12; i++){
        if(!monthlySpending2[i]){
          monthlySpending2[i] = { user_id : monthlySpending2[0].user_id, month : i+1, spending : 0 }
        }
      }
      monthlySpending = monthlySpending1.map((item, index) => ({
        family_id: item.family_id,
        month: item.month,
        spending: (Number(item.spending) + Number(monthlySpending2[index].spending))
      }))
    }
  }
  const monthIndex = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  let incomeTable = {}
  for (let i = 0; i < monthIndex.length; i++) {
      incomeTable[monthIndex[i] + '월'] = 0
  }
  for(i=0;i<monthlyIncome.length;i++){
    incomeTable[monthlyIncome[i].month + '월'] = Number( monthlyIncome[i].income )
  }
  let spendingTable = {}
  for (let i = 0; i < monthIndex.length; i++) {
      spendingTable[monthIndex[i] + '월'] = 0
  }
  for(i=0;i<monthlySpending.length;i++){
    spendingTable[monthlySpending[i].month + '월'] = Number( monthlySpending[i].spending )
  }
  return [ incomeTable, spendingTable ]
}

const categoryView = async( userId, familyId, year, month ) => {
  let result = []
  let result1 = []
  let result2 = []
  if(familyId){
    result1 = await moneyFlowDao.getThisMonthGeneralSpendingByFamily( familyId, year, month )
    result2 = await moneyFlowDao.getThisMonthFixedSpendingByFamily( familyId, year, month )
    for(i=0; i<result1.length; i++){
      result1[i].spending = Number(result1[i].spending)
    }
    for(i=0; i<result2.length; i++){
      result2[i].spending = Number(result2[i].spending)
    }
    for(j=0; j<result1.length; j++){
      for(i=0; i<result2.length; i++){
        if(result1[j].category == result2[i].category){
          result1[j].spending = result1[j].spending + result2[i].spending
          result2.splice(i,i+1)
        }
      }
    }
    result = result1.concat(result2)
  }else if (userId){
    result1 = await moneyFlowDao.getThisMonthGeneralSpendingByPrivate( userId, year, month )
    result2 = await moneyFlowDao.getThisMonthFixedSpendingByPrivate( userId, year, month )
    for(i=0; i<result1.length; i++){
      result1[i].spending = Number(result1[i].spending)
    }
    for(i=0; i<result2.length; i++){
      result2[i].spending = Number(result2[i].spending)
    }
    for(j=0; j<result1.length; j++){
      for(i=0; i<result2.length; i++){
        if(result1[j].category == result2[i].category){
          result1[j].spending = result1[j].spending + result2[i].spending
          result2.splice(i,i+1)
        }
      }
    }
    result = result1.concat(result2)
  }
  
  const category = await moneyFlowDao.getCategory()
  for (j=0; j<result.length; j++){
    for (i=0; i<category.length; i++){
      if(category[i].category===result[j].category){
        category[i].spending = Number(result[j].spending)
      }
    }
  }
  for (i=0; i<category.length; i++){
    if(!category[i].spending){category[i].spending = 0} 
  }
  let max = 0
  for (i=0; i<category.length; i++){
    max = max + Number(category[i].spending)}

  for (i=0; i<category.length; i++){
    category[i].spending = Math.round(category[i].spending*100 / max ) + '%'
  }
  
  return category
}

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
  return familyUserFlows;
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

const getUsedMoneyFlowsByYearMonthAndGetSum = async (userId, year, month) => {
  let flowTypeId = 2;
  const flows = await moneyFlowDao.getUsedOrGotMoneyFlowsByUserIdByYearMonth(userId, flowTypeId, year, month);
  return await flows.reduce((acc, flow) => acc + flow.amount, 0);
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
  const typeId = await flowTypeService.getIdByFlowStatus(type);
  if (!typeId) {
    error.throwErr(404, 'NOT_EXISTING_TYPE');
  }
  return await moneyFlowDao.updateMoneyFlow(id, userId, typeId, categoryId, memo, amount, year, month, date);
}

const deleteMoneyFlow = async (id, userId) => {
  return await moneyFlowDao.deleteMoneyFlow(id, userId);
}

module.exports = {
  search,
  yearlyView,
  categoryView,
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
  getUsedMoneyFlowsByYearMonthAndGetSum,
  getMoneyFlowsByFamilyUserIdByYearMonthDate,
  updateMoneyFlow,
  deleteMoneyFlow
}