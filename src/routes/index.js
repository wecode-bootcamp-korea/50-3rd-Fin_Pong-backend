const express = require('express');
const router = express.Router();
// const middleware = require('../middlewares/index')

const flowRouter = require('./flowRouter')

router.use('/flow', flowRouter.router)


module.exports = router;
