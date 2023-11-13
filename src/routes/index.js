const express = require('express');
const router = express.Router();
// const middleware = require('../middlewares/index')

const settingRouter = require('./settingRouter')

router.use('/setting', settingRouter.router)

module.exports = router;
