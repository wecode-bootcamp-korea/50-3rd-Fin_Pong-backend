const express = require("express");
const router = express.Router();

const usersFamilyController = require('../controllers/usersFamilyController');

router.get('/user', usersFamilyController.getUsersFamilyByUsersId);

module.exports.router = router;