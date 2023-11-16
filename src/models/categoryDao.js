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

const getNameById = async (categoryId) => {
  return await appDataSource.query(
    `
    SELECT category 
    FROM categories 
    WHERE id = ?
    `,
    [categoryId]
  )
}

module.exports = {
  getIdByCategoryName,
  getNameById
}