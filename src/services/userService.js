const userDao = require('../models/userDao');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const error = require('../utils/error');
const dotenv = require('dotenv');
dotenv.config();

const signInSignUp = async (code) => {
  const authToken = await axios.post(
    'https://kauth.kakao.com/oauth/token',
    {},
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.REST_API_KEY,
        code,
        redirect_uri: process.env.AUTH_REDIRECT_URI,
      },
    },
  );
  const kakaoAccessToken = authToken.data['access_token'];
  const result = await axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: `Bearer ${kakaoAccessToken}`,
    },
  });
  if (!result || result.status !== 200) {
    error.throwErr(400, 'KAKAO_CONNECTION ERROR');
  }

  const email = result.data['kakao_account']['email'];
  const existingUser = await userDao.getUserByEmail(email);
  if (existingUser.length === 0) {
    const createdUserId = await userDao.createUserByEmail(email);
    const token = jwt.sign({ email: email, id: createdUserId }, process.env.TYPEORM_SECRET_KEY);
    return {
      needsAdditionalInfo: true,
      message: 'LOG_IN_SUCCESS',
      token: token,
      email: email,
      id: createdUserId,
    };
  } else {
    if (existingUser['updated_at'] === null) {
      /**
       * redirect 시켜야 합니다. FrontEnd Server가 로그인/회원가입/추가 정보 기입 페이지 외의 페이지를 로드하기 전에
       * 백엔드로부터 미들웨어로 전부 필수정보 미기입 유저라는 것을 받아서 페이지 로딩을 다르게 하게 분기처리 하거나,
       * 로그인/회원가입 페이지에 존재하는 백엔드와의 api,
       * 추가 정보 기입 페이지에서 요청하는 api를 제외한 모든 api에
       * 페이지 로딩을 해 주지 말고 추가 정보 기입 페이지로 redirect하라는 페이지 사용 거부 과정을 넣으면
       * 추가 정보 기입을 해야 페이지를 로드하여 api를 요청할 수 있게 할 수 있습니다.
       * 추가로 로그인/회원가입/추가정보 기입 외의 api에는 updated_at이 null이면 서버가 요청에 대한 실행을 중단하고 에러를 내도록 설정해야 합니다.
       * 또한 FrontEnd Server는 로그인/회원가입/추가정보 기입 페이지의 로드에 updated_at이 null이어도 로드가 가능하도록 설정해야 합니다.
       * (로드 과정에서는 handling 불필요, api 요청 이후에만 handling 필요)
       * - 최현수
       */
    }
    const token = jwt.sign(
      { email: email, id: existingUser[0]['id'] },
      process.env.TYPEORM_SECRET_KEY,
    );
    return {
      // 추가 정보가 들어가 있는 지 확인이 되지 않았는데 추가정보 입력 필요 여부를 false로 날리면 안됩니다(수정 필요) - 최현수
      needsAdditionalInfo: false,
      message: 'LOG_IN_SUCCESS',
      token: token,
      email: email,
      id: existingUser[0]['id'],
    };
  }
};

const updateUserData = async (name, phoneNumber, birthdate, email) => {
  return await userDao.updateUserData(name, phoneNumber, birthdate, email);
};

const getUserInfo = async (userId) => {
  const [result] = await userDao.getUserInfo(userId);
  return result;
};

const getNameById = async (userId) => {
  const result = await userDao.getNameById(userId);
  return result[0]['name'];
};

const getUserUpdatedAt = async (userId) => {
  const updatedAt = await userDao.getUserUpdatedAt(userId);
  return await updatedAt[0]['updated_at'];
};

module.exports = {
  signInSignUp,
  updateUserData,
  getUserInfo,
  getNameById,
  getUserUpdatedAt,
};
