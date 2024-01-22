const express = require('express');
const router = express.Router();

const { loginRequired } = require('../utils/auth');
const budgetController = require('../controllers/budgetController');
router.use(loginRequired);

router.get('/rest', budgetController.getRestBudget);
router.post('/', budgetController.postBudget);
router.get('/', budgetController.getBudgetByCondition);
router.put('/', budgetController.updateBudget);

module.exports.router = router;
