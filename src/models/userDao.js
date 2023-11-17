const { appDataSource } = require('../utils/dataSource');

const getUserByEmail = async(email) => {
  const result = await appDataSource.query(
    `
    SELECT * 
    FROM users 
    WHERE email = ?
    `,
    [email]
    )
  if (result.insertId === 0) {
  error.throwErr(500, 'DATA_INSERTION_FAILED');
  }
  else {
    return result;
  }
};

const createUserByEmail = async(email) => {
  const result = await appDataSource.query(
    `
    INSERT INTO users (email) 
    VALUES (?)
    `,
    [email]
    );

  if (result.insertId === 0) {
  error.throwErr(500, 'DATA_INSERTION_FAILED');
  }
  else {
    return result.insertId;
  }
};


const addInformation = async(name, phoneNumber ,birthdate, email) => {
  const result = await appDataSource.query(
    `
    UPDATE users
    SET name = ?,
    phone_number = ?, 
    birthdate = ? 
    WHERE email = ?
    `,
    [name, phoneNumber, birthdate, email]
    )
  if (result.insertId === 0) {
  error.throwErr(500, 'DATA_INSERTION_FAILED');
  }
  else {
    return result;
  }
};

const getUserInformationById = async( userId ) => {
  
  const [ result ] = await appDataSource.query(`
    SELECT id AS userId
    FROM users
    WHERE id = ?;
  `, 
  [ userId ])
  const [ result1 ] = await appDataSource.query(`
    SELECT u.id AS userId, uf.family_id AS familyId, role_id AS roleId
    FROM users u
    JOIN users_families uf 
    ON u.id = uf.user_id
    WHERE u.id = ?;
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
  createUserByEmail,
  addInformation,
  getUserInformationById
}