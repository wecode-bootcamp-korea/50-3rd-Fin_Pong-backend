const familyService = require('../services/familyService');

const newBook = async (req, res) => {
  try {
    const userData = req.userData
    const uuid = await familyService.newBook(userData);
    res.status(201).json({
      message : 'AUTH_CODE_CREATED_SUCCESS',
      authcode : uuid
    })
  } catch(err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
};

const joinBook = async(req, res) => {
  try{
    const userData = req.userData;
    const authCode = req.body.auth_code;
    const result = await familyService.joinBook(userData, authCode);
    res.status(201).json({
      message : 'JOIN_SUCCESS'
    })
  } catch(err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
};

const getFamilyAuthCode = async(req, res) => {
  try{
    const familyId = req.userData.familyId;
    const result = await familyService.getFamilyAuthCode(familyId);
    res.status(200).json({ 
      authCode : result
    })
  } catch(err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({message: err.message || 'INTERNAL_SERVER_ERROR'});
  }
};

module.exports = {
  newBook,
  joinBook,
  getFamilyAuthCode,
}