const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const userDao = require('../models/userDao')

const loginRequired = async (req, res, next) => {
  try {
    console.log("ddddd")
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      const error = new Error('NEED_ACCESS_TOKEN');
      error.statusCode = 401;
      return res.status(error.statusCode).json({ message: error.message });
    }
    const payload = await jwt.verify(accessToken, process.env.SECRET_KEY);
    const user = await userDao.getUserByEmail(payload);
    console.log(user)
    if (!user) {
      const error = new Error('USER_DOES_NOT_EXIST');
      error.statusCode = 404;
      return res.status(error.statusCode).json({ message: error.message });
    }
    req.user = user;
    next();
  } catch{
    const eroor = new Error('INVALID_ACCESS_TOKEN');
    eroor.statusCode = 401;
    throw eroor
  }
};

module.exports = { 
    loginRequired 
}
