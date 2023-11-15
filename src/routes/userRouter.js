const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { loginRequired } = require('../utils/auth');

router.post('/auth', userController.signInSignUp);
router.put('/update',loginRequired, userController.addInformation); //추가정보 입력, 개인정보 수정 동일
router.post('/family/book',async(req,res) => {
  console.log(req)
})

module.exports = {
  router
}