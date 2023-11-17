const flowDao = require('../models/flowDao')
const middleWare = require('../middlewares/index')

const search = async( data ) => {
    const query1 = await middleWare.queryBuilder1( data )
    const result1 = await flowDao.getConditionalGeneralInfo( query1 )
    for (i=0; i<result1.length; i++){
      result1[i].fixed_status = 0
    }

    const query2 = await middleWare.queryBuilder2( data )
    const result2 = await flowDao.getConditionalFixedInfo ( query2 )
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
    monthlyIncome =  await flowDao.getMonthlyIncomeByFamily( familyId, year )
    monthlySpending1 = await flowDao.getMonthlyGeneralSpendingByFamily( familyId, year )
    monthlySpending2 = await flowDao.getMonthlyFixedSpendingByFamily( familyId, year )
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
    monthlyIncome =  await flowDao.getMonthlyIncomeByPrivate( userId, year )
    monthlySpending1 = await flowDao.getMonthlyGeneralSpendingByPrivate( userId, year )
    monthlySpending2 = await flowDao.getMonthlyFixedSpendingByPrivate( userId, year )
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
    result1 = await flowDao.getThisMonthGeneralSpendingByFamily( familyId, year, month )
    result2 = await flowDao.getThisMonthFixedSpendingByFamily( familyId, year, month )
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
    result1 = await flowDao.getThisMonthGeneralSpendingByPrivate( userId, year, month )
    result2 = await flowDao.getThisMonthFixedSpendingByPrivate( userId, year, month )
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
  
  const category = await flowDao.getCategory()
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

module.exports = {
  search,
  yearlyView,
  categoryView,
}