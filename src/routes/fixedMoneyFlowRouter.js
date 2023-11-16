const express = require('express');
const router = express.Router();
const fixedMoneyFlowController = require('../controllers/fixedMoneyFlowController');

const { loginRequired } = require('../utils/auth');

router.get('/', loginRequired, fixedMoneyFlowController.getFixedMoneyFlows);
router.post('/', loginRequired, fixedMoneyFlowController.postFixedFlows);

module.exports.router = router;