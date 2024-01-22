const usersFamilyService = require('../services/usersFamilyService');
const error = require('../utils/error');
const ResponseHandler = require('../utils/http');

const getUsersFamilyByUsersId = async (req, res) => {
  try {
    const { familyId } = req.userData;
    if (!familyId) {
      error.throwErr(400, 'NOT_INCLUDED_IN_FAMILY');
    }
    const familyUsers = await usersFamilyService.getUserIdByFamilyId(familyId);
    return ResponseHandler.sendSuccessResponse(res, 200, 'GET', 'familyUsers', familyUsers);
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

module.exports = {
  getUsersFamilyByUsersId,
};
