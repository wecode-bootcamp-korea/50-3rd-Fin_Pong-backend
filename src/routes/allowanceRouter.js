const express = require('express');
const router = express.Router();

const { loginRequired } = require('../utils/auth');
const allowanceController = require('../controllers/allowanceController');
router.use(loginRequired);

router.get('/', allowanceController.getAllowancesByCondition);
router.get('/rest', allowanceController.getRestAllowance);
router.post('/', allowanceController.postAllowance);
router.put('/', allowanceController.updateAllowance);
router.delete('/', allowanceController.deleteAllowance);

module.exports.router = router;
