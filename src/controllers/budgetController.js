const budgetService = require('../services/budgetService');
const error = require('../utils/error');

const postBudget = async (req, res) => { // 관리자만 가능
  try {
    const { familyId, roleId } = req.userData;
    if (!familyId || !roleId) { // roleId가 0이면 일반, 1이면 관리자이므로 일반 가입자면 에러를 냅니다.
      error.throwErr('400', 'NOT_INCLUDED_IN_FAMILY_OR_NOT_AN_ADMIN');
    }
    const { budget, year, month } = req.body;
    if (!budget || !year || !month) {
      error.throwErr(400, 'KEY_ERROR');
    }
    await budgetService.postBudget(familyId, budget, year, month);
    return res.status(200).json({message: 'POST_SUCCESS'});
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
}

const getBudget = async (req, res) => {
  try {
    const { familyId, roleId } = req.userData;
    if (!familyId) {
      error.throwErr(400, 'NOT_INCLUDED_IN_FAMILY');
    }
    else if (roleId !== 0 && roleId !== 1) {
      error.throwErr(400, 'BAD_USER');
    }
    const budget = await budgetService.getBudget(familyId);
    return res.status(200).json({message: 'GET_SUCCESS', 'budget': budget});
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
}

const updateBudget = async (req, res) => { // 관리자만 가능합니다.
  try {
    const { userId, familyId, roleId } = req.userData;
    if (!familyId || !roleId) {
      error.throwErr('400', 'NOT_INCLUDED_IN_FAMILY_OR_NOT_AN_ADMIN');
    }
    else if (!userId) {
      error.throwErr('400', 'TOKEN_KEY_ERROR');
    }
    const { budget, year, month } = req.body;
    if (!budget || !year || !month) {
      error.throwErr('400', 'KEY_ERROR');
    }
    await budgetService.updateBudget(familyId, budget, year, month);
    return res.status(200).json({message: 'PUT_SUCCESS'});
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
}

module.exports = {
  postBudget,
  getBudget,
  updateBudget
}