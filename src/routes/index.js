const express = require('express');
const router = express.Router();

const flowTypeRouter = require('./flowTypeRouter');
const categoryRouter = require('./categoryRouter');
const usersFamilyRouter = require('./usersFamilyRouter');
const moneyFlowRouter = require('./moneyFlowRouter');
const fixedMoneyFlowRouter = require('./fixedMoneyFlowRouter');
const budgetRouter = require('./budgetRouter');
const allowanceRouter = require('./allowanceRouter');
const userRouter = require('../routes/userRouter');
const familyRouter = require('../routes/familyRouter');

router.use('/flow-type', flowTypeRouter.router);
router.use('/category', categoryRouter.router);
router.use('/family/user', usersFamilyRouter.router);
router.use('/flow', moneyFlowRouter.router);
router.use('/flow/fixed', fixedMoneyFlowRouter.router);
router.use('/budget', budgetRouter.router);
router.use('/allowance', allowanceRouter.router);
router.use('/users', userRouter.router);
router.use('/family', familyRouter.router);

module.exports = router;
