const { appDataSource } = require('../utils/dataSource');
const error = require('../utils/error');

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

const postMoneyFlow = async (userId, typeId, categoryId, memo, amount, year, month, date) => {
  const result = await appDataSource.query(
    `
    INSERT INTO money_flows(user_id, flow_type_id, category_id, memo, amount, year, month, date)
    VALUES(?,?,?,?,?,?,?,?)
    `,
    [userId, typeId, categoryId, memo, amount, year, month, date]
  )
  if (result.insertId === 0) {
    error.throwErr(409, 'ALREADY_EXISTS');
  }
  else {
    return result;
  }
}

const getMoneyFlowsByUserId = async (userId) => {
  return await appDataSource.query(
    `
    SELECT id, user_id, flow_type_id, category_id, memo, amount, year, month, date
    FROM money_flows 
    WHERE user_id = ? 
    ORDER BY year desc, month desc, date desc, category_id, amount desc
    `,
    [userId]
  )
}

const getMoneyFlowsByUserIdByYear = async (userId, year) => {
  return await appDataSource.query(
    `
    SELECT id, user_id, flow_type_id, category_id, memo, amount, year, month, date
    FROM money_flows 
    WHERE user_id = ? 
    AND year = ?
    ORDER BY month desc, date desc, category_id, amount desc
    `,
    [userId, year]
  )
}

const getMoneyFlowsByUserIdByYearMonth = async (userId, year, month) => {
  return await appDataSource.query(
    `
    SELECT id, user_id, flow_type_id, category_id, memo, amount, year, month, date
    FROM money_flows 
    WHERE user_id = ? 
    AND year = ?
    AND month = ?
    ORDER BY date desc, category_id, amount desc
    `,
    [userId, year, month]
  )
}

const getUsedOrGotMoneyFlowsByUserIdByYearMonth = async (userId, flowTypeId, year, month) => {
  return await appDataSource.query(
    `
    SELECT id, user_id, flow_type_id, category_id, memo, amount, year, month, date
    FROM money_flows 
    WHERE user_id = ? 
    AND flow_type_id = ?
    AND year = ?
    AND month = ?
    ORDER BY date desc, category_id, amount desc
    `,
    [userId, flowTypeId, year, month]
  )
}


const getMoneyFlowsByUserIdByYearDate = async (userId, year, date) => {
  return await appDataSource.query(
    `
    SELECT id, user_id, flow_type_id, category_id, memo, amount, year, month, date
    FROM money_flows 
    WHERE user_id = ? 
    AND year = ?
    AND date = ?
    ORDER BY month asc, category_id, amount desc
    `,
    [userId, year, date]
  )
}

const getMoneyFlowsByUserIdByYearMonthDate = async (userId, year, month, date) => {
  return await appDataSource.query(
    `
    SELECT id, user_id, flow_type_id, category_id, memo, amount, year, month, date
    FROM money_flows 
    WHERE user_id = ? 
    AND year = ?
    AND month = ?
    AND date = ?
    ORDER BY category_id, amount desc
    `,
    [userId, year, month, date]
  )
}

const updateMoneyFlow = async (id, userId, typeId, categoryId, memo, amount, year, month, date) => {
  return await appDataSource.query(
    `
    UPDATE money_flows 
    SET flow_type_id = ?, category_id = ?, memo = ?, amount = ?, year = ?, month = ?, date = ? 
    WHERE id = ?
    AND user_id = ?
    `,
    [typeId, categoryId, memo, amount, year, month, date, id, userId]
  )
}

const deleteMoneyFlow = async (id, userId) => {
  const result = await appDataSource.query(
    `
    DELETE FROM money_flows 
    WHERE id = ?
    AND user_id = ?
    `,
    [id, userId]
  )
  if (result.affectedRows === 0) {
    error.throwErr(409, 'NOT_AUTHORIZED_TO_DELETE_OR_ALREADY_DELETED');
  }
  return result;
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
  postMoneyFlow,
  getMoneyFlowsByUserId,
  getMoneyFlowsByUserIdByYear,
  getMoneyFlowsByUserIdByYearMonth,
  getMoneyFlowsByUserIdByYearDate,
  getMoneyFlowsByUserIdByYearMonthDate,
  getUsedOrGotMoneyFlowsByUserIdByYearMonth,
  updateMoneyFlow,
  deleteMoneyFlow
}