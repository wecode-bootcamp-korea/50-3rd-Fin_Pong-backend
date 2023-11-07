const express = require('express');
const router = express.Router();
const moneyFlowRouter = require('./moneyFlowRouter')

router.use('/flow', moneyFlowRouter.router)

module.exports = router;