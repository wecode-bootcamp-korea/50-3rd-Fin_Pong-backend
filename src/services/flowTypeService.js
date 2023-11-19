const flowTypeDao = require('../models/flowTypeDao');

const getFlowStatusById = async (flowTypeId) => {
  const result = await flowTypeDao.getFlowStatusById(flowTypeId);
  return result[0].status;
}

const getIdByFlowStatus = async (type) => {
  const result = await flowTypeDao.getIdByFlowStatus(type);
  return result[0].id;
}

module.exports = {
  getFlowStatusById,
  getIdByFlowStatus
}