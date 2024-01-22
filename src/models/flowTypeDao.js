const { appDataSource } = require('../utils/dataSource');

const getFlowTypes = async () => {
  return await appDataSource.query(
    `
    SELECT id, status as 'option'
    FROM flow_type
    `,
  );
};

const getFlowStatusById = async (flowTypeId) => {
  return await appDataSource.query(
    `
    SELECT status 
    FROM flow_type 
    WHERE id = ?
    `,
    [flowTypeId],
  );
};

const getIdByFlowStatus = async (type) => {
  return await appDataSource.query(
    `
    SELECT id
    FROM flow_type
    WHERE status = ?
    `,
    [type],
  );
};

module.exports = {
  getFlowTypes,
  getFlowStatusById,
  getIdByFlowStatus,
};
