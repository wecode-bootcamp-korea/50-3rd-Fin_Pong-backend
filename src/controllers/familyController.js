const familyService = require('../services/familyService');
const { httpResponseHandler } = require('../utils/response');

const postFamily = async (req, res) => {
  // 관리자로서의 가족 그룹 생성
  try {
    const userData = req.userData;
    const roleId = 1;
    const uuid = await familyService.postFamily(userData, roleId);
    res.status(201).json({
      message: 'AUTH_CODE_CREATED_SUCCESS',
      authcode: uuid,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

const postUsersFamily = async (req, res) => {
  // 일반 사용자의 가족 그룹 참여
  try {
    const userData = req.userData;
    const authCode = req.body['auth_code'];
    // 일반 사용자의 roleId === 0
    const roleId = 0;
    await familyService.postUsersFamily(userData, authCode, roleId);
    // FrontEnd Server와 조율해서 POST로 수정해서 메세지 통일 필요
    return httpResponseHandler.sendSuccessResponse(res, 201, 'JOIN');
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

const getFamilyAuthCode = async (req, res) => {
  try {
    const familyId = req.userData.familyId;
    const result = await familyService.getFamilyAuthCode(familyId);
    return httpResponseHandler.sendSuccessResponse(res, 200, 'GET', 'authCode', result);
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

module.exports = {
  postFamily,
  postUsersFamily,
  getFamilyAuthCode,
};
