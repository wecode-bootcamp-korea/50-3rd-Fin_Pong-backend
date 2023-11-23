const familyDao = require('../models/familyDao');
const middleWare = require('../middlewares/index');

const newBook = async(userData) => {
  const uuid = await middleWare.makeUuid();
  const familyId = await familyDao.insertUuid( uuid );
  const result = await familyDao.insertUserFamilyId(userData, familyId);
  return uuid;
};

const joinBook = async(userData, authCode) => {
  const findFamilyId = await familyDao.findFamilyId(authCode)
  return result = await familyDao.addFamilyBook(userData.userId, findFamilyId[0].familyId);
};

const getFamilyAuthCode = async( familyId ) => {
  const findFamilyAuthCode = await familyDao.getFamilyAuthCode( familyId )
  return findFamilyAuthCode;
};

module.exports = {
  newBook,
  joinBook,
  getFamilyAuthCode,
}