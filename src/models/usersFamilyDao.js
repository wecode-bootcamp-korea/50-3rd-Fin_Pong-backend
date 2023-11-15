const { appDataSource } = require('../utils/dataSource');
const error = require('../utils/error');

const getFamilyId = async (userId) => {
  const result = await appDataSource.query(
    `
    SELECT family_id as familyId
    FROM users_families 
    WHERE user_id = ?
    `,
    [userId]
  )
  return result[0]['familyId'];
}

const getUsersByFamilyId = async (familyId) => { // JOIN 사용해서 users 에도 접근합니다.
  return await appDataSource.query(
    `
    SELECT users_families.user_id as 'id', users.name as 'option'
    FROM users_families 
    JOIN USERS 
    ON users_families.user_id = users.id
    WHERE users_families.family_id = ?
    `,
    [familyId]
  )
}

module.exports = {
  getFamilyId,
  getUsersByFamilyId
}