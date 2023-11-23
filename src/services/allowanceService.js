const allowanceDao = require('../models/allowanceDao');
const moneyFlowDao = require('../models/moneyFlowDao');

const postAllowance = async (userId, allowance, year, month) => {
  return await allowanceDao.postAllowance(userId, allowance, year, month);
}

const getAllowances = async (familyUserIds) => { // 모든 가족 구성원의 모든 용돈을 찾습니다.
  const result = await Promise.all(
    familyUserIds.map(async (familyUserId) => {
      return await allowanceDao.getAllowance(familyUserId);
    })
  )
  return result.flat();
}

const getAllowancesByYear = async (familyUserIds, year) => { // 모든 가족 구성원의 특정 연도의 용돈을 모두 찾습니다.
  const result = await Promise.all(
    familyUserIds.map(async (familyUserId) => {
      return await allowanceDao.getAllowanceByYear(familyUserId, year);
    })
  )
  return result.flat();
}

const getAllowancesByYearMonth = async (familyUserIds, year, month) => { // 모든 가족 구성원의 특정 연, 월의 용돈을 모두 찾습니다.
  const result = await Promise.all(
    familyUserIds.map(async (familyUserId) => {
      return await allowanceDao.getAllowanceByYearMonth(familyUserId, year, month);
    })
  )
  return result.flat();
}

const getAllowancesByUserId = async (userId) => { // 단일 userId로 해당 user의 모든 용돈을 찾습니다.
  return await allowanceDao.getAllowance(userId);
}

const getAllowancesByUserIdByYear = async (userId, year) => { // 단일 userId로 해당 user 의 특정 연도의 모든 용돈을 찾습니다(내림차순)
  return await allowanceDao.getAllowanceByYear(userId, year);
}

const getAllowanceByUserIdByYearMonth = async (userId, year, month) => { // 단일 userId로 해당 user 의 특정 연, 월의 모든 용돈을 찾습니다(내림차순)
  return await allowanceDao.getAllowanceByYearMonth(userId, year, month);
}

const getAllowanceByUserIdByYearMonthAndGetAmount = async (userId, year, month) => {
  const allowance = await allowanceDao.getAllowanceByYearMonth(userId, year, month);
  return await allowance.reduce((acc, allowance) => acc + allowance.allowance, 0);
}

const getAllowanceByFamilyUserIdsByYearMonthAndGetAmount = async (familyUserIds, year, month) => { // 가족 전체 구성원의 특정 연, 월의  용돈의 금액을 합산합니다.
  let allowances = [];
  for (let i in familyUserIds) {
    let allowance = await allowanceDao.getAllowanceByYearMonth(familyUserIds[i], year, month);
    if (allowance.length) {
      allowances.push(allowance[0]);
    }
  }
  if (!allowances.length) { // 가족의 용돈이 할당돼 있지 않으면 0으로 사전에 처리합니다.
    return 0;
  }
  return await allowances.reduce((acc, allowance) => acc + allowance.allowance, 0);
}


const updateAllowance = async (userId, allowance, year, month) => { // userName, year, month(수정 전)가 수정 전의 지표인 함수
  return await allowanceDao.updateAllowance(userId, allowance, year, month);
}

const updateAllowanceById = async (allowanceId, allowance, year, month) => { // id가 수정 전의 지표인 버전
  return await allowanceDao.updateAllowanceById(allowanceId, allowance, year, month);
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
  getAllowancesByYear,
  getAllowancesByYearMonth,
  getAllowancesByUserId,
  getAllowancesByUserIdByYear,
  getAllowanceByUserIdByYearMonth,
  getAllowanceByUserIdByYearMonthAndGetAmount,
  getAllowanceByFamilyUserIdsByYearMonthAndGetAmount,
  updateAllowance,
  updateAllowanceById,
  deleteAllowance,
  deleteAllowanceById
}