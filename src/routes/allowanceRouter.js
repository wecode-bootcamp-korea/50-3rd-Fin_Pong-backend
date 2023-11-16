const express = require('express');
const router = express.Router();

const { loginRequired } = require('../utils/auth');
const allowanceController = require("../controllers/allowanceController");

router.get('/', loginRequired,  allowanceController.getAllowances);
router.post('/', loginRequired, allowanceController.postAllowance);
router.put('/', loginRequired, allowanceController.updateAllowance);
router.delete('/', loginRequired, allowanceController.deleteAllowance);

module.exports.router = router;