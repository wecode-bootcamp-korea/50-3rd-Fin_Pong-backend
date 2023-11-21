const flowTypeService = require('../services/flowTypeService');

const getFlowTypes = async (req, res) => {
  try {
    const flowTypes = await flowTypeService.getFlowTypes();
    return res.status(200).json({message: 'GET_SUCCESS', types: flowTypes})
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
}

module.exports = {
  getFlowTypes
}