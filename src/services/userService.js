const userDao = require('../models/userDao');

const getNameById = async (userId) => {
  const result = await userDao.getNameById(userId);
  return result[0].name;
}

module.exports = {
  getNameById
}