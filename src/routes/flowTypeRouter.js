const express = require('express');
const router = express.Router();
const flowTypeController = require('../controllers/flowTypeController');

router.get('/', flowTypeController.getFlowTypes);

module.exports.router = router;
