const allowanceDao = require('../models/allowanceDao');

const postAllowance = async (userId, amount, year, month) => {
  return await allowanceDao.postAllowance(userId, amount, year, month);
}

const getAllowances = async (familyUserIds) => {
  let result = [];
  for (let familyUserId in familyUserIds) {
    let allowances = await allowanceDao.getAllowance(familyUserId);
    result = result.concat(allowances);
  }
  return result;
}

const updateAllowance = async (userId, amount, year, month) => {
  return await allowanceDao.updateAllowances(userId, amount, year, month);
}

const getAllowancesByYearMonth = async (userId, year, month) => { // Dao 재탕으로 인해 쓰임이 없어졌는데 연월별 용돈 검색 떄 활용할 수 있을 것 같아 두겠습니다.
  return await allowanceDao.getAllowanceByYearMonth(userId, year, month);
}

const deleteAllowance = async (userId, year, month) => {
  return await allowanceDao.deleteAllowance(userId, year, month);
}


module.exports = {
  postAllowance,
  getAllowances,
  updateAllowance,
  getAllowancesByYearMonth,
  deleteAllowance }