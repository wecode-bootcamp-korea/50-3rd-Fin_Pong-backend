const userService = require('../services/userService');

const signInSignUp = async (req, res) => {
  try {
    const code  = req.body.codeKakao;
  if (!code) {
    const error = new Error('KEY_ERROR');
    error.statusCode = 400;
    throw error;
  };
  const result = await userService.signInSignUp(code);

  return res.status(200).json(result);
  } catch(err) {
    console.error(err);
    return res.status(500 || err.statusCode).json({message: 'INTERNAL_SERVER_ERROR'});
  }
};

const addInformation = async(req, res)=>{
  try {
  const email = req.user.email;
  const {name, phoneNumber ,birthdate} = req.body;
  if(!name || !phoneNumber || !birthdate){
    const error = new Error('KEY_ERROR');
    error.statusCode = 400;
    throw error;
  } 
  await userService.addInformation(name, phoneNumber ,birthdate, email);
  return res.status(201).json({message:'ADD_INFORMATION_SUCCESS'});
  } catch(err) {
    console.error(err);
    return res.status(500 || err.statusCode).json({message: 'ERROR_OCCURED'});
  } 
};

const userInfo = async(req, res) => {
  try{
    const userId = req.userData.userId
    const result = await userService.userInfo(userId)
    res.status(200).json(result)
  }catch(err){
    console.error(err);
    return res.status(500 || err.statusCode).json({message: 'ERROR_OCCURED'});
  }
};

module.exports = {
  signInSignUp,
  addInformation,
  userInfo,
}