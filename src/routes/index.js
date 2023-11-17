const express = require('express');
const router = express.Router();
const userRouter = require('../routes/userRouter');
const familyRouter = require('../routes/familyRouter');

router.use('/users', userRouter.router);
router.use('/family', familyRouter.router);

module.exports = router;