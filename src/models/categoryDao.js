const { appDataSource } = require('../utils/dataSource');

const getIdByCategoryName = async (category) => {
  return await appDataSource.query(
    `
    SELECT id as categoryId 
    FROM categories
    WHERE category = ? 
    `,
    [category]
  )
}

module.exports = {
  getIdByCategoryName
}