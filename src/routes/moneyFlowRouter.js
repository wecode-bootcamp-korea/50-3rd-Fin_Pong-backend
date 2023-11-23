const express = require('express');
const router = express.Router();

const { loginRequired } = require('../utils/auth');
const flowController = require('../controllers/moneyFlowController');

router.get('/search', loginRequired, flowController.search);
router.get('/view', loginRequired, flowController.view);
router.post('/', loginRequired, flowController.postMoneyFlow);
router.get('/', loginRequired, flowController.getMoneyFlowsByCondition);
router.put('/', loginRequired, flowController.updateMoneyFlow);
router.delete('/', loginRequired, flowController.deleteMoneyFlow);

module.exports.router = router;
