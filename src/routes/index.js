const express = require('express');
const router = express.Router();
const categoryRouter = require('./categoryRoutes')

router.use('/category', categoryRouter.router);

module.exports = router;