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
  let monthlySpending = []
  if(familyId){
    monthlyIncome =  await flowDao.getMonthlyIncomeByFamily( familyId, year )
    monthlySpending = await flowDao.getMonthlySpendingByFamily( familyId, year )
  }else if (userId){
    monthlyIncome =  await flowDao.getMonthlyIncomeByPrivate( userId, year )
    monthlySpending = await flowDao.getMonthlySpendingByPrivate( userId, year )
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
  if(familyId){
    result = await flowDao.getThisMonthSpendingByFamily( familyId, year, month )
  }else if (userId){
    result = await flowDao.getThisMonthSpendingByPrivate( userId, year, month )
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