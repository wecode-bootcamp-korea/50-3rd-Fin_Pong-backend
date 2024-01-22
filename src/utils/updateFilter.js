const error = require('./error');
const userService = require('../services/userService');

const usersUpdateFilter = async (req, res, next) => {
  try {
    const { userId } = req.userData;
    if ((await userService.getUserUpdatedAt(userId)) === null) {
      return res.redirect('http://localhost:3000');
    }
    next();
  } catch (err) {
    console.log('USER_DATA_NOT_UPDATED');
    res.status(err.statusCode || 500).json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

module.exports = {
  usersUpdateFilter,
};
