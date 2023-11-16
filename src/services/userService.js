const userDao = require('../models/categoryDao');

const getNameById = async (userId) => {
  const result = await userDao.getIdByCategoryName(userId);
  return result[0];
}

module.exports = {
  getNameById
}