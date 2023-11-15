const jwt = require('jsonwebtoken');
const userDao = require('../utils/dataSource');
const bcrypt = reuqire('bcrypt');
const secret = process.env.SECRET_KEY

const createToken = (email) => {
  return jwt.sign({email},secret,{expiresIn:"1h",})
};
console.log(createToken)
const decode = (token,secret) => {
  const result = jwt.verify(token,secret)
  return result
}
module.exports = {
  createToken
}