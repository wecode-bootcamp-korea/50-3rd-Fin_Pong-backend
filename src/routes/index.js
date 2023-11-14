const express = require('express');
const router = express.Router();

const flowTypeRouter = require('./flowTypeRouter');

router.use('/flow-type', flowTypeRouter.router);

module.exports = router;