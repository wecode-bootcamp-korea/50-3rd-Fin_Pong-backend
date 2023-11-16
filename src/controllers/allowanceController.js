const allowanceService = require('../services/allowanceService');
const usersFamilyService = require('../services/usersFamilyService');
const error = require('../utils/error');

const postAllowance = async (req, res) => { // 관리자만 가능
  try {
    const { familyId, roleId } = req.userData;
    if (!familyId || !roleId) {
      error.throwErr(400, 'NOT_INCLUDED_IN_FAMILY_OR_NOT_AN_ADMIN');
    }
    const { userName, amount, year, month } = req.body;
    if (!userName ||!amount || !year || !month) {
      error.throwErr(400, 'KEY_ERROR');
    }
    const userId = await usersFamilyService.getAuthenticUserId(familyId, userName);
    await allowanceService.postAllowance(userId, amount, year, month);
    return res.status(200).json({message: 'POST_SUCCESS'});
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
}

const getAllowances = async (req, res) => { // 일반 유저도 가능
  try {
    const { familyId } = req.userData;
    if (!familyId) {
      error.throwErr(400, 'NOT_INCLUDED_IN_FAMILY');
    }
    const familyUsersIds = await usersFamilyService.getFamilyUsersIds(familyId);
    const allowances = await allowanceService.getAllowances(familyUsersIds);
    return res.status(200).json({message: 'GET_SUCCESS', allowances: allowances});
  } catch(err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
}

const updateAllowance = async (req, res) => { // 관리자만 가능
  try {
    const { familyId, roleId } = req.userData;
    if (!familyId || !roleId) {
      error.throwErr(401, 'NOT_INCLUDED_IN_FAMILY_OR_NOT_AN_ADMIN');
    }
    const { userName, amount, year, month } = req.body;
    if (!userName ||!amount || !year || !month) {
      error.throwErr(400, 'KEY_ERROR');
    }
    const userId = await usersFamilyService.getAuthenticUserId(familyId, userName); // 삭제 대상 userName을 가진 users.id입니다
    await allowanceService.updateAllowance(userId, amount, year, month);
    return res.status(200).json({message: 'PUT_SUCCESS'});
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
}

const deleteAllowance = async (req, res) => { // 관리자만 가능
  try {
    const { familyId, roleId } = req.userData;
    if (!familyId || !roleId) {
      error.throwErr(400, 'NOT_INCLUDED_IN_FAMILY_OR_NOT_AN_ADMIN');
    }
    const { userName, year, month } = req.body;
    console.log(userName, year, month);
    if (!userName || !year || !month) {
      error.throwErr(400, 'KEY_ERROR');
    }
    const userId = await usersFamilyService.getAuthenticUserId(familyId, userName);
    await allowanceService.deleteAllowance(userId, year, month);
    return res.status(200).json({message: 'DELETE_SUCCESS'});
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
}

module.exports = {
  postAllowance,
  getAllowances,
  updateAllowance,
  deleteAllowance
}