const express = require("express");
const router = express.Router();

const allowanceRouter = require("./allowanceRouter");

router.use('/allowance', allowanceRouter.router)

module.exports = router;