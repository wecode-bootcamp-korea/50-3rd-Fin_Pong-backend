const usersFamilyDao = require('../models/usersFamilyDao');

const getFamilyId = async (userId) => {
  return await usersFamilyDao.getFamilyId(userId);
}

const getUserIdByFamilyId = async (familyId) => {
  return await usersFamilyDao.getUsersByFamilyId(familyId);
}

module.exports = {
  getFamilyId,
  getUserIdByFamilyId
}