const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { loginRequired } = require('../utils/auth');

router.post('/auth', userController.signInSignUp);
router.get('/info', loginRequired, userController.getUserInfo);
router.put('/update', loginRequired, userController.updateUserData);

module.exports.router = router;
