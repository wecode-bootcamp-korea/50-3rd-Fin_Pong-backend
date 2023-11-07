const { appDataSource } = require('../utils/dataSource');

const getFlowStatusById = async (flowTypeId) => {
  return await appDataSource.query(
    `
    SELECT status 
    FROM flow_type 
    WHERE id = ?
    `,
    [flowTypeId]
  )
}

module.exports = {
  getFlowStatusById
}