const userService = require('../services/userService');
const error = require('../utils/error');

const signInSignUp = async (req, res) => {
  try {
    const code = req.body['codeKakao'];
    if (!code) {
      error.throwErr(400, 'KEY_ERROR');
    }
    const result = await userService.signInSignUp(code);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

const updateUserData = async (req, res) => {
  try {
    const email = req.user.email;
    const { name, phoneNumber, birthdate } = req.body;
    if (!name || !phoneNumber || !birthdate) {
      error.throwErr(400, 'KEY_ERROR');
    }
    await userService.updateUserData(name, phoneNumber, birthdate, email);
    return res.status(201).json({ message: 'ADD_INFORMATION_SUCCESS' });
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const result = await userService.getUserInfo(userId);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

module.exports = {
  signInSignUp,
  updateUserData,
  getUserInfo,
};
