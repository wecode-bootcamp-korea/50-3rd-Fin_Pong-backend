const express = require('express');
const router = express.Router();

const { loginRequired } = require('../utils/auth');
const flowController = require('../controllers/moneyFlowController');
router.use(loginRequired);

router.get('/search', flowController.search);
router.get('/view', flowController.getChartDataOfMoneyFlows);
router.post('/', flowController.postMoneyFlow);
router.get('/', flowController.getMoneyFlowsByCondition);
router.put('/', flowController.updateMoneyFlow);
router.delete('/', flowController.deleteMoneyFlow);

module.exports.router = router;
