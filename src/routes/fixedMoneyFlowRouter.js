const express = require('express');
const router = express.Router();
const fixedMoneyFlowController = require('../controllers/fixedMoneyFlowController');

const { loginRequired } = require('../utils/auth');

router.get('/', loginRequired, fixedMoneyFlowController.getFixedMoneyFlowsByCondition);
router.post('/', loginRequired, fixedMoneyFlowController.postFixedFlows);
router.put('/', loginRequired, fixedMoneyFlowController.updateFixedMoneyFlows);
router.delete('/', loginRequired, fixedMoneyFlowController.deleteFixedMoneyFlows);

module.exports.router = router;