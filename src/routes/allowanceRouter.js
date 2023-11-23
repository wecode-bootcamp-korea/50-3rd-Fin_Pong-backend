const express = require('express');
const router = express.Router();

const { loginRequired } = require('../utils/auth');
const allowanceController = require('../controllers/allowanceController');

router.get('/', loginRequired,  allowanceController.getAllowancesByCondition);
router.get('/rest', loginRequired,  allowanceController.getRestAllowance);
router.post('/', loginRequired, allowanceController.postAllowance);
router.put('/', loginRequired, allowanceController.updateAllowance);
router.delete('/', loginRequired, allowanceController.deleteAllowance);

module.exports.router = router;