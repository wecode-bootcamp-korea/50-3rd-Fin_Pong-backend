const jwt = require('jsonwebtoken');
const userDao = require('../models/userDao');
const error = require('./error');
const secretKey = process.env.TYPEORM_SECRET_KEY;

const loginRequired = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      // .subtr()은 deprecated 됐기 때문에 Bearer에 split()으로 token을 call하는 게 낫습니다.
      const accessToken = authorizationHeader.split(' ')[1];
      const payload = jwt.verify(accessToken, secretKey);
      const [user] = await userDao.getUserByEmail(payload.email);
      if (!user) {
        // 사용자가 db에 존재하지 않을 경우
        error.throwErr(404, 'USER_DOES_NOT_EXIST');
      }
      req.user = user;
      req.userData = await userDao.getUserInformationById(user.id); // family에 가입하지 않은 경우에 { userId: user.id} 만 return합니다.
      next();
    } else {
      error.throwErr(401, 'SOMETHING_WENT_WRONG'); // 정확한 오류 원인을 알려주면 보안상으로 취약합니다. - 최현수
    }
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'INTERNAL_SERVER_ERROR' });
  }
};

module.exports = {
  loginRequired,
};
