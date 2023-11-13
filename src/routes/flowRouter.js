const express = require('express');
const flowController = require('../controllers/flowController');

const router = express.Router();

router.get('/search', flowController.search );
router.get('/view', flowController.view );

module.exports = {
  router,
};