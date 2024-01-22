const { appDataSource } = require('../utils/dataSource');
const error = require('../utils/error');

const getSumOfGeneralMoneyFlowsByFamilyByYearByMonthGroup = async (flowTypeId, familyId, year) => {
  // (리뷰) 소비만 뽑아내면 수입을 뽑아내야 할 때 코드를 더 만들어야 됩니다. - Choi Hyunsu
  return await appDataSource.query(
    `
    SELECT
      uf.family_id,
      month,
      CAST(SUM(amount) AS UNSIGNED) AS spending
    FROM money_flows mf
    JOIN users_families uf 
    ON mf.user_id = uf.user_id
    WHERE mf.flow_type_id = ?
    AND uf.family_id = ? 
    AND mf.year = ?
    GROUP BY month
    ORDER BY month ASC;
`,
    [flowTypeId, familyId, year],
  );
};

const getSumOfGeneralMoneyFlowsByPrivateByYearByMonthGroup = async (flowTypeId, userId, year) => {
  return await appDataSource.query(
    `
    SELECT
      uf.user_id,
      month,
      CAST(SUM(amount) AS UNSIGNED) AS spending
    FROM money_flows mf
    JOIN users_families uf 
    ON mf.user_id = uf.user_id
    WHERE mf.flow_type_id = ?
    AND uf.user_id = ? 
    AND mf.year = ?
    GROUP BY month
    ORDER BY month ASC;
`,
    [flowTypeId, userId, year],
  );
};

const getSumOfGeneralMoneyFlowsByFamilyByYearMonthByCategoryGroup = async (
  flowTypeId,
  familyId,
  year,
  month,
) => {
  return await appDataSource.query(
    `
    SELECT
      uf.family_id,
      c.category,
      CAST(SUM(amount) AS UNSIGNED) AS spending
    FROM money_flows mf
    JOIN users_families uf 
    ON uf.user_id = mf.user_id
    JOIN categories c 
    ON mf.category_id = c.id
    WHERE uf.family_id = ?  
    AND mf.year = ?
    AND mf.month = ?
    AND mf.flow_type_id = ?
    GROUP BY c.category
    ORDER BY mf.month ASC;
  `,
    [familyId, year, month, flowTypeId],
  );
};

const getSumOfGeneralMoneyFlowsByPrivateByYearMonthByCategoryGroup = async (
  flowTypeId,
  userId,
  year,
  month,
) => {
  return await appDataSource.query(
    `
    SELECT
      mf.user_id,
      c.category,
      CAST(SUM(amount) AS UNSIGNED) AS spending
    FROM money_flows mf
    JOIN categories c on mf.category_id = c.id
    WHERE user_id = ? 
    AND mf.year = ?
    AND mf.month = ?
    AND mf.flow_type_id = ?
    GROUP BY c.category
    ORDER BY mf.month asc;
`,
    [userId, year, month, flowTypeId],
  );
};

const getConditionalGeneralInfo = async (query) => {
  return await appDataSource.query(query);
};

const getConditionalFixedInfo = async (query) => {
  return await appDataSource.query(query);
};

const postMoneyFlow = async (userId, typeId, categoryId, memo, amount, year, month, date) => {
  const result = await appDataSource.query(
    `
    INSERT INTO money_flows(user_id, flow_type_id, category_id, memo, amount, year, month, date)
    VALUES(?,?,?,?,?,?,?,?)
    `,
    [userId, typeId, categoryId, memo, amount, year, month, date],
  );
  if (result.insertId === 0) {
    error.throwErr(409, 'ALREADY_EXISTS');
  } else {
    return result;
  }
};

const getMoneyFlowsByUserId = async (userId) => {
  return await appDataSource.query(
    `
    SELECT id, user_id, flow_type_id, category_id, memo, amount, year, month, date
    FROM money_flows 
    WHERE user_id = ? 
    ORDER BY year desc, month desc, date desc, category_id, amount desc
    `,
    [userId],
  );
};

const getMoneyFlowsByUserIdByYear = async (userId, year) => {
  return await appDataSource.query(
    `
    SELECT id, user_id, flow_type_id, category_id, memo, amount, year, month, date
    FROM money_flows 
    WHERE user_id = ? 
    AND year = ?
    ORDER BY month desc, date desc, category_id, amount desc
    `,
    [userId, year],
  );
};

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
    [userId, year, month],
  );
};

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
    [userId, flowTypeId, year, month],
  );
};

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
    [userId, year, date],
  );
};

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
    [userId, year, month, date],
  );
};

const updateMoneyFlow = async (id, userId, typeId, categoryId, memo, amount, year, month, date) => {
  return await appDataSource.query(
    `
    UPDATE money_flows 
    SET flow_type_id = ?, category_id = ?, memo = ?, amount = ?, year = ?, month = ?, date = ? 
    WHERE id = ?
    AND user_id = ?
    `,
    [typeId, categoryId, memo, amount, year, month, date, id, userId],
  );
};

const deleteMoneyFlow = async (id, userId) => {
  const result = await appDataSource.query(
    `
    DELETE FROM money_flows 
    WHERE id = ?
    AND user_id = ?
    `,
    [id, userId],
  );
  if (result.affectedRows === 0) {
    error.throwErr(409, 'NOT_AUTHORIZED_TO_DELETE_OR_ALREADY_DELETED');
  }
  return result;
};

module.exports = {
  getSumOfGeneralMoneyFlowsByFamilyByYearByMonthGroup,
  getSumOfGeneralMoneyFlowsByPrivateByYearByMonthGroup,
  getSumOfGeneralMoneyFlowsByFamilyByYearMonthByCategoryGroup,
  getSumOfGeneralMoneyFlowsByPrivateByYearMonthByCategoryGroup,
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
  deleteMoneyFlow,
};
