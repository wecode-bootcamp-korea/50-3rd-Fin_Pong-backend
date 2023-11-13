const express = require('express');
const router = express.Router();
const categoryRouter = require('./categoryRouter')

router.use('/category', categoryRouter.router);

module.exports = router;