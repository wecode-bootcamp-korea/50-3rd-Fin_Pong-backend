const express = require('express');
const router = express.Router();

const { loginRequired } = require('../utils/auth');
const budgetController = require('../controllers/budgetController');

router.post('/', loginRequired, budgetController.postBudget);
router.get('/', loginRequired, budgetController.getBudget);
router.put('/', loginRequired, budgetController.updateBudget);

module.exports.router = router;