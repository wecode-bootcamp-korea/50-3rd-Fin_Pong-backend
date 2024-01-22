const budgetDao = require('../models/budgetDao');
const error = require('../utils/error');

const postBudget = async (familyId, budget, year, month) => {
  return await budgetDao.postBudget(familyId, budget, year, month);
};

const getBudget = async (familyId) => {
  return await budgetDao.getBudget(familyId);
};

const getBudgetByYear = async (familyId, year) => {
  return await budgetDao.getBudgetByYear(familyId, year);
};

const getBudgetByYearMonth = async (familyId, year, month) => {
  return await budgetDao.getBudgetByYearMonth(familyId, year, month);
};

const getBudgetByYearMonthAndGetAmount = async (familyId, year, month) => {
  const budget = await budgetDao.getBudgetByYearMonth(familyId, year, month);
  if (!budget.length) {
    return 0;
  }
  const amount = budget[0].budget;
  return await amount;
};

const updateBudget = async (familyId, budget, year, month) => {
  return await budgetDao.updateBudget(familyId, budget, year, month);
};

module.exports = {
  postBudget,
  getBudget,
  getBudgetByYear,
  getBudgetByYearMonth,
  getBudgetByYearMonthAndGetAmount,
  updateBudget,
};
