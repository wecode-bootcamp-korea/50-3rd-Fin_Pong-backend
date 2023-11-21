const express = require('express');
const router = express.Router();
const usersFamilyRouter = require('./usersFamilyRouter');

router.use('/family/user', usersFamilyRouter.router)

module.exports = router;
