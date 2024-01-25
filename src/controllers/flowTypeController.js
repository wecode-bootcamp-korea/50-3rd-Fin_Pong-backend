const flowTypeService = require('../services/flowTypeService');
const { httpResponseHandler } = require('../utils/response');

const getFlowTypes = async (req, res) => {
  try {
    const flowTypes = await flowTypeService.getFlowTypes();
    return httpResponseHandler.sendSuccessResponse(res, 200, 'GET', 'types', flowTypes);
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

module.exports = {
  getFlowTypes,
};
