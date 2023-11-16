const express = require('express');
const router = express.Router();

const budgetRouter = require('./budgetRouter');

router.use('/budget', budgetRouter.router);

module.exports = router;