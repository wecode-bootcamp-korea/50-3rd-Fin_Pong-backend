const allowanceDao = require('../models/allowanceDao');

const getAllowanceByFamilyUserIdsByYearMonthAndGetAmount = async (familyUserIds, year, month) => {
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

module.exports = {
  getAllowanceByFamilyUserIdsByYearMonthAndGetAmount
}