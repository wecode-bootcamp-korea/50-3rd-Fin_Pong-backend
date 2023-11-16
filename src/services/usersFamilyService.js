const usersFamilyDao = require('../models/usersFamilyDao');

const getUserIdByFamilyId = async (familyId) => {
  return await usersFamilyDao.getUsersByFamilyId(familyId);
}

const getAuthenticUserId = async (familyId, userName) => {
  const familyUsers = await usersFamilyDao.getUsersByFamilyId(familyId);
  let userId = 0;
  for (let i in familyUsers) { // 가족 구성원 중 용돈을 주고자 하는 이름을 이용해서 users.id를 찾습니다.
    if (await familyUsers[i]['option'] === userName) {
      userId += familyUsers[i].id;
      return userId;
    }
  }

}

const getFamilyUsersIds = async (familyId) => {
  const familyUsers = await usersFamilyDao.getUsersByFamilyId(familyId);
  let userIds = [];
  for (let i in await familyUsers) {
    userIds.push(await familyUsers[i].id);
  }
  return userIds;
}

module.exports = {
  getUserIdByFamilyId,
  getAuthenticUserId,
  getFamilyUsersIds
}