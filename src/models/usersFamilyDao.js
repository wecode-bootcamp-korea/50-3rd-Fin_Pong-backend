const { appDataSource } = require('../utils/dataSource');
const error = require('../utils/error');

const getFamilyId = async (userId) => {
  const result = await appDataSource.query(
    `
    SELECT family_id as familyId
    FROM users_families 
    WHERE user_id = ?
    `,
    [userId],
  );
  return result[0]['familyId'];
};

const getUsersByFamilyId = async (familyId) => {
  // JOIN 사용해서 users 에도 접근합니다.
  return await appDataSource.query(
    `
    SELECT users_families.user_id as 'id', users.name as 'option'
    FROM users_families 
    JOIN users 
    ON users_families.user_id = users.id
    WHERE users_families.family_id = ?
    `,
    [familyId],
  );
};

const postUsersFamily = async (userId, familyId, roleId) => {
  // roleId를 다르게 넣으면 권한이 달라집니다.
  const result = await appDataSource.query(
    `
    INSERT INTO users_families(user_id, family_id, role_id)
    VALUES( ?, ?, ?);
  `,
    [userId, familyId, roleId],
  );
  if (result.insertId === 0) {
    error.throwErr(500, 'DATA_INSERTION_FAILED');
  }
  return result;
};

module.exports = {
  getFamilyId,
  getUsersByFamilyId,
  postUsersFamily,
};
