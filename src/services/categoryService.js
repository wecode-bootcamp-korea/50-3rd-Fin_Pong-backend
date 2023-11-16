const categoryDao = require('../models/categoryDao');
const error = require('../utils/error');

const getIdByCategoryName = async (category) => {
  const result = await categoryDao.getIdByCategoryName(category);
  return await result[0]['categoryId'];
}

module.exports = {
  getIdByCategoryName
}