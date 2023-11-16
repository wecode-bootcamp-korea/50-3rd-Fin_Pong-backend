const express = require("express");
const router = express.Router();

const { loginRequired } = require('../utils/auth');
const usersFamilyController = require('../controllers/usersFamilyController');

router.get('/user', loginRequired, usersFamilyController.getUsersFamilyByUsersId);

module.exports.router = router;