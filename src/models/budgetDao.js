const { appDataSource } = require('../utils/dataSource');
const error = require('../utils/error');

const postBudget = async (familyId, budget, year, month) => {
  try {
    const result = await appDataSource.query(
      `
    INSERT IGNORE INTO budget(family_id, budget, year, month) 
    VALUES(?, ?, ?, ?)
      `,
      [familyId, budget, year, month]
    )
    if (result.affectedRows === 0) {
      error.throwErr(500, 'DUPLICATED_BUDGET_IGNORED');
    }
    return result;
  } catch (err) {
    throw err;
  }
}

const getBudget = async (familyId) => {
  return await appDataSource.query(
    `
    SELECT id, budget, year, month
    FROM budget 
    WHERE family_id = ?
    ORDER BY year DESC, month DESC
    `,
    [familyId]
  )
}

const updateBudget = async (familyId, budget, year, month) => {
  return await  appDataSource.query(
    `
    UPDATE budget 
    SET budget = ?
    WHERE family_id = ?
    AND year = ? AND month = ?
    `,
    [budget, familyId, year, month]
  )
}

module.exports = {
  postBudget,
  getBudget,
  updateBudget
}

