const allowanceDao = require('../models/allowanceDao');

const postAllowance = async (userId, allowance, year, month) => {
  return await allowanceDao.postAllowance(userId, allowance, year, month);
}

const getAllowances = async (familyUserIds) => {
  let result = [];
  for (let familyUserId in familyUserIds) {
    let allowances = await allowanceDao.getAllowance(familyUserId);
    result = result.concat(allowances);
  }
  return result;
}

const updateAllowance = async (userId, allowance, year, month) => { // userName, year, month(수정 전)가 수정 전의 지표인 함수
  return await allowanceDao.updateAllowance(userId, allowance, year, month);
}

const updateAllowanceById = async (allowanceId, allowance, year, month) => { // id가 수정 전의 지표인 버전
  return await allowanceDao.updateAllowanceById(allowanceId, allowance, year, month);
}

const getAllowancesByYearMonth = async (userId, year, month) => { // Dao 재탕으로 인해 쓰임이 없어졌는데 연월별 용돈 검색 떄 활용할 수 있을 것 같아 두겠습니다.
  return await allowanceDao.getAllowanceByYearMonth(userId, year, month);
}

const deleteAllowance = async (userId, year, month) => {
  return await allowanceDao.deleteAllowance(userId, year, month);
}

const deleteAllowanceById = async (allowanceId) => {
  return await allowanceDao.deleteAllowanceById(allowanceId);
}

module.exports = {
  postAllowance,
  getAllowances,
  updateAllowance,
  updateAllowanceById,
  getAllowancesByYearMonth,
  deleteAllowance,
  deleteAllowanceById
}