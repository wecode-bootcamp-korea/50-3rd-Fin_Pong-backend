const { appDataSource } = require('../utils/dataSource');
const error = require('../utils/error');

const postBudget = async (familyId, budget, year, month) => {
  const result = await appDataSource.query(
    `
    INSERT IGNORE INTO budget(family_id, budget, year, month) 
    VALUES(?, ?, ?, ?)
      `,
    [familyId, budget, year, month],
  );
  if (result.affectedRows === 0) {
    error.throwErr(409, 'ALREADY_EXISTS');
  }
  return result;
};

const getBudget = async (familyId) => {
  return await appDataSource.query(
    `
    SELECT id, budget, year, month
    FROM budget 
    WHERE family_id = ?
    ORDER BY year DESC, month DESC
    `,
    [familyId],
  );
};

const getBudgetByYear = async (familyId, year) => {
  return await appDataSource.query(
    `
    SELECT id, budget, year, month
    FROM budget 
    WHERE family_id = ?
    AND year = ?
    ORDER BY month DESC
    `,
    [familyId, year],
  );
};

const getBudgetByYearMonth = async (familyId, year, month) => {
  return await appDataSource.query(
    `
    SELECT id, budget, year, month
    FROM budget 
    WHERE family_id = ?
    AND year = ?
    AND month = ?
    `,
    [familyId, year, month],
  );
};

const updateBudget = async (familyId, budget, year, month) => {
  const updateRows = await appDataSource.query(
    `
    UPDATE budget 
    SET budget = ?
    WHERE family_id = ?
    AND year = ?
    AND month = ?
    `,
    [budget, familyId, year, month],
  );
  if (updateRows.affectedRows === 0) {
    error.throwErr(409, 'SOMETHING_WENT_WRONG');
  }
};

const getBudgetAsIncomeByFamilyByYear = async (familyId, year) => {
  return await appDataSource.query(
    `
    SELECT 
      family_id, 
      month, 
      budget AS income 
    FROM budget
    WHERE family_id = ? 
    AND year = ?
    ORDER BY month ASC;
    `,
    [familyId, year],
  );
};

module.exports = {
  postBudget,
  getBudget,
  getBudgetByYear,
  getBudgetByYearMonth,
  updateBudget,
  getBudgetAsIncomeByFamilyByYear, // - 홍영기 파트 함수
};
