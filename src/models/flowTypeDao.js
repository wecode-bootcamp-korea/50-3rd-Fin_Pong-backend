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

const getIdByFlowStatus = async (type) => {
  return await appDataSource.query(
    `
    SELECT id
    FROM flow_type
    WHERE status = ?
    `,
    [type]
  )
}

module.exports = {
  getFlowStatusById,
  getIdByFlowStatus
}