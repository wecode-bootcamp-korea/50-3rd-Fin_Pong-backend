const flowTypeDao = require('../models/flowTypeDao');
const error = require('../utils/error');

const getFlowTypes = async () => {
  const flowTypes = await flowTypeDao.getFlowTypes();
  if (flowTypes.length === 0) {
    error.throwErr(404, 'NOT_FOUND_TYPE');
  }
  return flowTypes;
}

module.exports = {
  getFlowTypes
}