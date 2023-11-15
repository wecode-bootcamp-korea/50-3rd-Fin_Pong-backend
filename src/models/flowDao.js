const { appDataSource } = require('../utils/dataSource')

const search = async( userId, date ) => {
  
}

const getMonthlyIncomeByFamily = async( familyId, year ) => {
  return await appDataSource.query(`
    SELECT 
      family_id, 
      month, 
      budget AS income 
    FROM budget
    WHERE family_id = ? AND year = ?
    ORDER BY month ASC;
  `, [ familyId, year ])
}

const getMonthlyIncomeByPrivate = async( userId, year ) => {
  return await appDataSource.query(`
    SELECT
      user_id,
      month,
      amount AS income
    FROM allowances
    WHERE user_id = ? AND year = ?
    ORDER BY month ASC;
  `, [ userId, year ])
}

const getMonthlySpendingByFamily = async( familyId, year ) => {
  return await appDataSource.query(`
    SELECT
      uf.family_id,
      month,
      sum(amount) AS spending
    FROM money_flows mf
    JOIN users_families uf ON mf.user_id = uf.user_id
    WHERE mf.flow_type_id = 2 AND uf.family_id = ? AND mf.year = ?
    GROUP BY month
    ORDER BY month ASC;
`, [ familyId, year ])
}

const getMonthlySpendingByPrivate = async( userId, year ) => {
  return await appDataSource.query(`
    SELECT
      uf.user_id,
      month,
      sum(amount) AS spending
    FROM money_flows mf
    JOIN users_families uf ON mf.user_id = uf.user_id
    WHERE mf.flow_type_id = 2 AND uf.user_id = ? AND mf.year = ? AND mf.category_id = 3
    GROUP BY month
    ORDER BY month ASC;
`, [ userId, year ])
}

const getThisMonthSpendingByFamily = async( familyId, year, month ) => {
  return await appDataSource.query(`
    SELECT
      uf.family_id,
      c.category,
      sum(amount) AS spending
    FROM money_flows mf
    JOIN users_families uf ON uf.user_id = mf.user_id
    JOIN categories c ON mf.category_id = c.id
    WHERE uf.family_id = ?  AND mf.year = ?
                            AND mf.month = ?
                            AND mf.flow_type_id = 2
    GROUP BY c.category
    ORDER BY mf.month ASC;
  `, [ familyId, year, month ])
}

const getThisMonthSpendingByPrivate = async( userId, year, month ) => {
  return await appDataSource.query(`
    SELECT
      mf.user_id,
      c.category,
      sum(amount) AS spending
    FROM money_flows mf
    JOIN categories c on mf.category_id = c.id
    WHERE user_id = ? AND mf.year = ?
                      AND mf.month = ?
                      AND mf.flow_type_id = 2
    GROUP BY c.category
    ORDER BY mf.month asc;
`, [ userId, year, month ])
}

const getCategory = async() => {
  return await appDataSource.query(`
    SELECT * FROM categories;
`)
}

const getConditionalGeneralInfo = async( query ) => {
  return await appDataSource.query(query)
}

const getConditionalFixedInfo = async( query ) => {
  return await appDataSource.query(query)
}

module.exports = {
  search,
  getMonthlyIncomeByFamily,
  getMonthlyIncomeByPrivate,
  getMonthlySpendingByFamily,
  getMonthlySpendingByPrivate,
  getThisMonthSpendingByFamily,
  getThisMonthSpendingByPrivate,
  getCategory,
  getConditionalGeneralInfo,
  getConditionalFixedInfo,
}