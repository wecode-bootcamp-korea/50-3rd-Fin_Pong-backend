const usersFamilyService = require('../services/usersFamilyService');

const getUsersFamilyByUsersId = async (req, res) => {
  try {
    const userId = 1;
    const familyId = await usersFamilyService.getFamilyId(userId);
    const familyUsers = await usersFamilyService.getUserIdByFamilyId(familyId);
    return res.status(200).json({message: 'GET_SUCCESS', 'familyUsers': familyUsers});
  } catch (err) {
    console.error(err);
    return res.status(500 || err.status).json({message: err.message || 500});
  }
}

module.exports = {
  getUsersFamilyByUsersId
}