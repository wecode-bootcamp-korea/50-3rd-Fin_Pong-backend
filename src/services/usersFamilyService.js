const usersFamilyDao = require('../models/usersFamilyDao');
const error = require('../utils/error')

const getFamilyUsersIds = async (familyId) => {
  const familyUsers = await usersFamilyDao.getUsersByFamilyId(familyId);
  const userIds = await Promise.all(familyUsers.map(async (user) => {
    return user.id;
  }));
  return userIds;
};

module.exports = {
  getFamilyUsersIds
}