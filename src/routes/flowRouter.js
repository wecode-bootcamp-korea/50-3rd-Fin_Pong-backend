const express = require('express');
const router = express.Router();

const flowController = require('../controllers/flowController');
const { loginRequired } = require('../utils/auth');

router.get('/search', loginRequired, flowController.search );
router.get('/view', loginRequired, flowController.view );

module.exports = {
  router,
};