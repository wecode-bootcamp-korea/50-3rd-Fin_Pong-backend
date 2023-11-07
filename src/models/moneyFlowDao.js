const { appDataSource } = require('../utils/dataSource');
const error = require('../utils/error');

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

const deleteMoneyFlow = async (id) => {
  const result = await appDataSource.query(
    `
    DELETE FROM money_flows 
    WHERE id = ?
    `,
    [id]
  )
  if (result.affectedRows === 0) {
    error.throwErr(409, 'NOT_EXISTING_OR_ALREADY_DELETED');
  }
  return result;
}

module.exports = {
  postMoneyFlow,
  getMoneyFlowsByUserId,
  getMoneyFlowsByUserIdByYear,
  getMoneyFlowsByUserIdByYearMonth,
  getMoneyFlowsByUserIdByYearDate,
  getMoneyFlowsByUserIdByYearMonthDate,
  updateMoneyFlow,
  deleteMoneyFlow
}