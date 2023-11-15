const { appDataSource } = require('../utils/dataSource');
const { v4 } = require('uuid');

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

module.exports = {
  getUserByEmail,
  createUserByEmail,
  addInformation
}