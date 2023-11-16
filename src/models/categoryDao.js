const { appDataSource } = require('../utils/dataSource');

const getCategoriesByIds = async (categoryIds) => {
  return await appDataSource.query(
    `
    SELECT id, category as 'option'
    FROM categories
    WHERE id IN (?)
    `,
    [categoryIds]
  )
}

module.exports = {
  getCategoriesByIds
}