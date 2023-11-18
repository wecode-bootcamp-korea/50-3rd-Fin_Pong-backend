const userDao = require('../models/userDao');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const signInSignUp = async(code) => {
  try{
    const authToken = await axios.post('https://kauth.kakao.com/oauth/token', {}, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params:{
        grant_type: 'authorization_code',
        client_id: process.env.REST_API_KEY,
        code,
        redirect_uri: process.env.AUTH_REDIRECT_URI
      }
    });
    const kakaoAccessToken = authToken.data.access_token
  const result = await axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: `Bearer ${kakaoAccessToken}`,
    },
  });
  if (!result || result.status !== 200) {
    const error = new Error('KAKAO_CONNECTION ERROR');
    error.statusCode = 400;
    throw error;
  };
  
  const email = result.data.kakao_account.email
  const existingUser = await userDao.getUserByEmail(email);
  if(existingUser.length === 0) {
    const createUser = await userDao.createUserByEmail(email); 
    const token = jwt.sign({email: email,id: createUser},process.env.TYPEORM_SECRET_KEY);
    return {
    needsAdditionalInfo: true,
    message: 'LOG_IN_SUCCESS',
    token: token,
    email: email,
    id: createUser
    };
  } else {
  const token = jwt.sign({email :email,id:existingUser[0].id},process.env.TYPEORM_SECRET_KEY);
  return {
    needsAdditionalInfo: false,
    message: 'LOG_IN_SUCCESS',
    token: token,
    email: email,
    id : existingUser[0].id
  }};
  } catch(err) {
    console.log(err);
    throw err;
  };
};

const addInformation = async(name, phoneNumber ,birthdate, email) => {
  try{
    return await userDao.addInformation(name, phoneNumber ,birthdate, email);
  } catch(err) {
    console.log(err);
    throw err;
  }
};

const userInfo = async(userId) => {
  const [result] =  await userDao.getUserInfo(userId)
  return result
}

module.exports = {
  signInSignUp,
  addInformation,
  userInfo,
}