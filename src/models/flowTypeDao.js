const { appDataSource } = require('../utils/dataSource');

const getFlowTypes = async () => {
  return await appDataSource.query(
    `
    SELECT id, status as 'option'
    FROM flow_type
    `
  )
}

module.exports = {
  getFlowTypes
}