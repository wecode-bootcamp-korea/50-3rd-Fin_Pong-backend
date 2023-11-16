const fixedFlowService = require('../services/fixedMoneyFlowService');
const userService = require('../services/userService');
const categoryService = require('../services/categoryService');
const error = require('../utils/error');

const postFixedFlows = async (req, res) => { // 관리자만 가능
  try {
    const { userId, familyId, roleId } = req.userData;
    if (!familyId || !roleId) {
      error.throwErr(400, 'NOT_INCLUDED_IN_FAMILY_OR_NOT_AN_ADMIN');
    }
    const { type, category, memo, amount, startYear, startMonth, startDate, endYear, endMonth } = req.body;
    if ( !type || !category || !memo || !amount || !startYear || !startMonth || !startDate || !endYear || !endMonth) {
      error.throwErr(400, 'KEY ERROR');
    }
    const categoryId = await categoryService.getIdByCategoryName(category);
    const fixedMoneyFlowIds = await fixedFlowService.postFixedMoneyFlows(userId, type, categoryId, memo, amount, startYear, startMonth, startDate, endYear, endMonth);
    const fixedMoneyFlowsGroupId = await fixedFlowService.postFixedMoneyFlowsGroup();
    await fixedFlowService.postMiddleFixedMoneyFlows(fixedMoneyFlowIds, fixedMoneyFlowsGroupId);
    return res.status(200).json({message: 'POST_SUCCESS'});
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
}

const getFixedMoneyFlows = async (req, res) => {
  try {
    const { userId, familyId, roleId } = req.userData;
    if (!familyId || !roleId) {
      error.throwErr(400, 'NOT_INCLUDED_IN_FAMILY_OR_NOT_AN_ADMIN');
    }
    const fixedMoneyFlows = await fixedFlowService.getFixedMoneyFlows(userId);
    return res.status(200).json({message: 'GET_SUCCESS', fixedFlow: fixedMoneyFlows});
    } catch (err) {
      console.error(err);
      return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
    }
}

module.exports = {
  postFixedFlows,
  getFixedMoneyFlows
}