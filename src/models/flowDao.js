const { appDataSource } = require('../utils/dataSource')

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

const getMonthlyGeneralSpendingByFamily = async( familyId, year ) => {
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

const getMonthlyFixedSpendingByFamily = async( familyId, year ) => {
  return await appDataSource.query(`
    SELECT
      uf.family_id,
      month,
      sum(amount) AS spending
    FROM fixed_money_flows fmf
    JOIN users_families uf ON fmf.user_id = uf.user_id
    WHERE fmf.flow_type_id = 2 AND uf.family_id = ? AND fmf.year = ?
    GROUP BY month
    ORDER BY month ASC;
`, [ familyId, year ])
}

const getMonthlyGeneralSpendingByPrivate = async( userId, year ) => {
  return await appDataSource.query(`
    SELECT
      uf.user_id,
      month,
      sum(amount) AS spending
    FROM money_flows mf
    JOIN users_families uf ON mf.user_id = uf.user_id
    WHERE mf.flow_type_id = 2 AND uf.user_id = ? AND mf.year = ?
    GROUP BY month
    ORDER BY month ASC;
`, [ userId, year ])
}

const getMonthlyFixedSpendingByPrivate = async( userId, year ) => {
  return await appDataSource.query(`
    SELECT
      uf.user_id,
      month,
      sum(amount) AS spending
    FROM fixed_money_flows fmf
    JOIN users_families uf ON fmf.user_id = uf.user_id
    WHERE fmf.flow_type_id = 2 AND uf.user_id = ? AND fmf.year = ?
    GROUP BY month
    ORDER BY month ASC;
`, [ userId, year ])
}

const getThisMonthGeneralSpendingByFamily = async( familyId, year, month ) => {
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

const getThisMonthFixedSpendingByFamily = async( familyId, year, month ) => {
  return await appDataSource.query(`
    SELECT
      uf.family_id,
      c.category,
      sum(amount) AS spending
    FROM fixed_money_flows fmf
    JOIN users_families uf ON uf.user_id = fmf.user_id
    JOIN categories c ON fmf.category_id = c.id
    WHERE uf.family_id = ?  AND fmf.year = ?
                            AND fmf.month = ?
                            AND fmf.flow_type_id = 2
    GROUP BY c.category
    ORDER BY fmf.month ASC;
  `, [ familyId, year, month ])
}

const getThisMonthGeneralSpendingByPrivate = async( userId, year, month ) => {
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

const getThisMonthFixedSpendingByPrivate = async( userId, year, month ) => {
  return await appDataSource.query(`
    SELECT
      fmf.user_id,
      c.category,
      sum(amount) AS spending
    FROM fixed_money_flows fmf
    JOIN categories c on fmf.category_id = c.id
    WHERE user_id = ? AND fmf.year = ?
                      AND fmf.month = ?
                      AND fmf.flow_type_id = 2
    GROUP BY c.category
    ORDER BY fmf.month asc;
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
  getMonthlyIncomeByFamily,
  getMonthlyIncomeByPrivate,
  getMonthlyGeneralSpendingByFamily,
  getMonthlyFixedSpendingByFamily,
  getMonthlyGeneralSpendingByPrivate,
  getMonthlyFixedSpendingByPrivate,
  getThisMonthGeneralSpendingByFamily,
  getThisMonthFixedSpendingByFamily,
  getThisMonthGeneralSpendingByPrivate,
  getThisMonthFixedSpendingByPrivate,
  getCategory,
  getConditionalGeneralInfo,
  getConditionalFixedInfo,
}