const categoryDao = require('../models/categoryDao');
const error = require('../utils/error');

const getIdByCategoryName = async (category) => {
  const result = await categoryDao.getIdByCategoryName(category);
  return await result[0]['categoryId'];
}

const getNameById = async (categoryId) => {
  const result = await categoryDao.getNameById(categoryId);
  return result[0]['category'];
}

module.exports = {
  getIdByCategoryName,
  getNameById
}