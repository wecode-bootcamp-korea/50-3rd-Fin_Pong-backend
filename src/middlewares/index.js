const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
const secret = process.env.TYPEORM_SECRET_KEY

const createToken = (email) => {
  return jwt.sign({email},secret,{expiresIn:"1h",});
};

const makeUuid = () => {
  const uuid = v4().split('-');
  const newUuid = uuid[0] + uuid[1];
  
  return newUuid.substr(0,8);
}

module.exports = {
  createToken,
  makeUuid,
}