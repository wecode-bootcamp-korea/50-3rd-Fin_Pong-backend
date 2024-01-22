const express = require('express');
const router = express.Router();
const fixedMoneyFlowController = require('../controllers/fixedMoneyFlowController');

const { loginRequired } = require('../utils/auth');
router.use(loginRequired);

router.get('/', fixedMoneyFlowController.getFixedMoneyFlowsByCondition);
router.post('/', fixedMoneyFlowController.postFixedFlows);
router.put('/', fixedMoneyFlowController.updateFixedMoneyFlows);
router.delete('/', fixedMoneyFlowController.deleteFixedMoneyFlows);

module.exports.router = router;
