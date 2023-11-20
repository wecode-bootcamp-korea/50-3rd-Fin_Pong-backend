const express = require('express');
const router = express.Router();

const { loginRequired } = require('../utils/auth');
const budgetController = require('../controllers/budgetController');

router.get('/rest', loginRequired, budgetController.getRestBudget);
router.post('/', loginRequired, budgetController.postBudget);
router.get('/', loginRequired, budgetController.getBudgetByCondition);
router.put('/', loginRequired, budgetController.updateBudget);

module.exports.router = router;