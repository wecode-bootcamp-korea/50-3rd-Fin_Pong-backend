const { appDataSource } = require('../utils/dataSource');
const getUserByEmail = async(email) => {
  return await appDataSource.query(
    `
    SELECT *
    FROM users
    WHERE email = ?
    `,
    [email]
  )
};

const getUserInformationById = async( userId ) => {
  const [ result ] = await appDataSource.query(
    `
    SELECT
    id AS userId
    FROM users
    WHERE id = ?
    `,
    [ userId ])
  const [ result1 ] = await appDataSource.query(
    `
    SELECT
    u.id AS userId,
    uf.family_id AS familyId,
    role_id AS roleId
    FROM users u
    JOIN users_families uf ON u.id = uf.user_id
    WHERE u.id = ?
    `,
    [ userId ])
  if (!result1) {
    return result;
  } else {
    return result1;
  }
}

module.exports = {
  getUserByEmail,
  getUserInformationById
}