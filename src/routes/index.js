const express = require('express');
const router = express.Router();

const fixedMoneyFlowRouter = require('./fixedMoneyFlowRouter');

router.use('/flow/fixed', fixedMoneyFlowRouter.router);

module.exports = router;