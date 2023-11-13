const categoryDao = require('../models/categoryDao');
const error = require('../utils/error');

const getCategory = async (type) => {
  const result = [];
  if (type === '지출') {
    for (let categoryId in [1, 2, 4]) {
      result.push(await categoryDao.getCategory(categoryId));
      result[result.length - 1]['type'] = type;
    }
  }
  else if (type === '수입') {
    result.push(await categoryDao.getCategory(3));
    result[0]['type'] = type;
  }
  return result;
}

module.exports = { getCategory}