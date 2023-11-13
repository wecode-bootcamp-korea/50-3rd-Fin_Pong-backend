const { appDataSource } = require('../utils/dataSource');
const error = require('../utils/error');

const getCategory = async (categoryId) => {
  const result = await appDataSource.query(
    `
    SELECT id, category FROM category
    WHERE id = ?
    `,
    [categoryId]
  )
  if (result.insertId === 0) {
    error.throwErr(500, 'DATA_INSERTION_FAILED');
  }
  else {
    return result;
  }
}

module.exports = { getCategory }