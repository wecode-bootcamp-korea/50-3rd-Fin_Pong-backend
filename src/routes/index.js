const express = require('express');
const router = express.Router();
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const userRouter = require('../routes/userRouter')

router.use('/users',userRouter.router)

module.exports = router;
