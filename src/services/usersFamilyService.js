const usersFamilyDao = require('../models/usersFamilyDao');

const getUserIdByFamilyId = async (familyId) => {
  return await usersFamilyDao.getUsersByFamilyId(familyId);
}

module.exports = {
  getUserIdByFamilyId
}