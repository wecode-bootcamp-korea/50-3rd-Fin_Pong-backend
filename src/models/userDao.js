const { appDataSource } = require('../utils/dataSource');
const error = require('../utils/error');

const getUserInfo = async (userId) => {
  return await appDataSource.query(
    `
    SELECT
      u.name AS userName, 
      uf.role_id AS roleId
    FROM users u 
    JOIN users_families uf
    ON u.id = uf.user_id
    WHERE u.id = ?;
    `,
    [userId],
  );
};

const getUserByEmail = async (email) => {
  return await appDataSource.query(
    `
    SELECT * 
    FROM users 
    WHERE email = ?
    `,
    [email],
  );
};

const createUserByEmail = async (email) => {
  const result = await appDataSource.query(
    `
    INSERT INTO users (email) 
    VALUES (?)
    `,
    [email],
  );

  if (result.insertId === 0) {
    error.throwErr(500, 'DATA_INSERTION_FAILED');
  } else {
    return result.insertId;
  }
};

const updateUserData = async (name, phoneNumber, birthdate, email) => {
  const result = await appDataSource.query(
    `
    UPDATE users
    SET name = ?,
    phone_number = ?, 
    birthdate = ? 
    WHERE email = ?
    `,
    [name, phoneNumber, birthdate, email],
  );
  if (result.insertId === 0) {
    error.throwErr(500, 'DATA_INSERTION_FAILED');
  } else {
    return result;
  }
};

const getUserInformationById = async (userId) => {
  const [result] = await appDataSource.query(
    `
    SELECT id AS userId
    FROM users
    WHERE id = ?
  `,
    [userId],
  );
  const [result1] = await appDataSource.query(
    `
    SELECT u.id AS userId, uf.family_id AS familyId, role_id AS roleId
    FROM users u
    JOIN users_families uf 
    ON u.id = uf.user_id
    WHERE u.id = ?
  `,
    [userId],
  );
  if (!result1) {
    return result;
  } else {
    return result1;
  }
};

const getNameById = async (userId) => {
  return await appDataSource.query(
    `
    SELECT name
    FROM users 
    WHERE id = ?
    `,
    [userId],
  );
};

const getUserUpdatedAt = async (userId) => {
  return await appDataSource.query(
    `
    SELECT updated_at
    FROM users
    WHERE user_id = ?
    `,
    [userId],
  );
};

module.exports = {
  getUserByEmail,
  createUserByEmail,
  updateUserData,
  getUserInformationById,
  getUserInfo,
  getNameById,
  getUserUpdatedAt,
};
