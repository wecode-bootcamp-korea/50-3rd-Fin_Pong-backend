const { appDataSource } = require('../utils/dataSource');

const getFlowTypes = async () => {
  return await appDataSource.query(
    `
    SELECT * FROM flow_type
    `
  )
}

module.exports = { getFlowTypes }