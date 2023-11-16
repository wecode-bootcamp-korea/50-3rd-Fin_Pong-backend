const jwt = require('jsonwebtoken');
const userDao = require('../utils/dataSource');
const bcrypt = require('bcrypt');
const { v4 } = require('uuid');
const secret = process.env.SECRET_KEY

const createToken = (email) => {
  return jwt.sign({email},secret,{expiresIn:"1h",});
};

const decode = (token,secret) => {
  const result = jwt.verify(token,secret);
  return result;
}

const makeUuid = () => {
  const uuid = v4().split('-');
  const newUuid = uuid[0] + uuid[1];
  
  return newUuid.substr(0,8);
}

module.exports = {
  createToken,
  makeUuid,
}