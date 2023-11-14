const categoryDao = require('../models/categoryDao');
const error = require('../utils/error');

const getCategory = async (type) => {
  let categoryIds = [1, 2, 4];
  let result = []
  if (type === '지출') {
    for (let i = 0; i < 3; i++) {
      let category = await categoryDao.getCategory(categoryIds[i]);
      result[i] = await category[0];
      result[i].type = type;
    }
  }
  else if (type === '수입') {
    let category = await categoryDao.getCategory(3)
    result[0] = await category[0]
    result[0].type = type;
  }
  return result;
}

module.exports = { getCategory}