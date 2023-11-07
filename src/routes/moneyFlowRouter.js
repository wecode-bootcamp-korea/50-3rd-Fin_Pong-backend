const express = require('express');
const router = express.Router();

const { loginRequired } = require('../utils/auth');
const moneyFlowController = require('../controllers/moneyFlowController');

router.post('/', loginRequired, moneyFlowController.postMoneyFlow);
router.get('/', loginRequired, moneyFlowController.getMoneyFlowsByCondition);
router.put('/', loginRequired, moneyFlowController.updateMoneyFlow);
router.delete('/', loginRequired, moneyFlowController.deleteMoneyFlow);

module.exports.router = router;
