const express = require('express');
const router = express.Router();

const flowRouter = require('./flowRouter')

router.use('/flow', flowRouter.router)

module.exports = router;
