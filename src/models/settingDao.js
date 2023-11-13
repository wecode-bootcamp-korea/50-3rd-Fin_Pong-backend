const { appDataSource } = require('../utils/dataSource')

const viewMonthFamily = async( familyId, year ) => {
  const monthlyIncome = await appDataSource.query(`
    SELECT family_id, month, budget AS income FROM budget
    WHERE family_id = ? AND year = ?
    ORDER BY month ASC;
  `, [ familyId, year ])
  const monthlySpending = await appDataSource.query(`
    SELECT uf.family_id, month, sum(amount) AS spending FROM money_flows mf
    JOIN users_families uf ON mf.user_id = uf.user_id
    WHERE mf.flow_type_id = 2 AND uf.family_id = ? AND mf.year = ?
    GROUP BY month
    ORDER BY month ASC;
  `, [ familyId, year ])
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
  return { '수입' : incomeTable, '지출' : spendingTable }
}

const viewMonthPrivate = async( userId, year ) => {
  const monthlyIncome = await appDataSource.query(`
    SELECT user_id,  month, amount AS income FROM allowances
    WHERE user_id = ? AND year = ?
    ORDER BY month ASC;
    `, [ userId, year ])

  const monthlySpending = await appDataSource.query(`
    SELECT uf.user_id, month, sum(amount) AS spending FROM money_flows mf
    JOIN users_families uf ON mf.user_id = uf.user_id
    WHERE mf.flow_type_id = 2 AND uf.user_id = ? AND mf.year = ?
    GROUP BY month
    ORDER BY month ASC;
  `, [ userId, year ])
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
  return { '수입' : incomeTable, '지출' : spendingTable }
}

const viewCategoryFamily = async( familyId, date ) => {
  const year = date.substr(0,4)
  const month = date.substr(5)
  const result = await appDataSource.query(`
    SELECT uf.family_id, c.category, sum(amount) AS spending FROM money_flows mf
    JOIN users_families uf ON uf.user_id = mf.user_id
    JOIN categories c ON mf.category_id = c.id
    WHERE uf.family_id = ?  AND mf.year = ?
                            AND mf.month = ?
                            AND mf.flow_type_id = 2
    GROUP BY c.category
    ORDER BY mf.month ASC;
  `, [ familyId, year, month ])
  const category = await appDataSource.query(`
    SELECT * FROM categories;
  `)
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

const viewCategoryPrivate = async( userId, date ) => {
  const year = date.substr(0,4)
  const month = date.substr(5)
  const result = await appDataSource.query(`
    SELECT mf.user_id, c.category, sum(amount) AS spending FROM money_flows mf
    JOIN categories c on mf.category_id = c.id
    WHERE user_id = ? AND mf.year = ?
                      AND mf.month = ?
                      AND mf.flow_type_id = 2
    GROUP BY c.category
    ORDER BY mf.month asc;
  `, [ userId, year, month ])
  const category = await appDataSource.query(`
    SELECT * FROM categories;
  `)
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
  viewMonthFamily,
  viewMonthPrivate,
  viewCategoryFamily,
  viewCategoryPrivate,
}