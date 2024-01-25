const familyDao = require('../models/familyDao');
const usersFamilyDao = require('../models/usersFamilyDao');
const middleWare = require('../middlewares/index');

const postFamily = async (userData, roleId) => {
  const uuid = middleWare.createCustomUuid();
  const familyId = await familyDao.postFamilyWithUuid(uuid);
  await usersFamilyDao.postUsersFamily(userData, familyId, roleId);
  return uuid;
};

const postUsersFamily = async (userData, authCode, roleId) => {
  const findFamilyId = await familyDao.findFamilyId(authCode);
  return await usersFamilyDao.postUsersFamily(userData.userId, findFamilyId[0].familyId, roleId);
};

const getFamilyAuthCode = async (familyId) => {
  return await familyDao.getFamilyAuthCode(familyId);
};

module.exports = {
  postFamily,
  postUsersFamily,
  getFamilyAuthCode,
};
