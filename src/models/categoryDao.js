const { appDataSource } = require('../utils/dataSource');

const getCategory = async (categoryId) => {
  return await appDataSource.query(
    `
    SELECT id, category as 'option'
    FROM categories
    WHERE id = ?
    `,
    [categoryId]
  )
}

module.exports = { getCategory }