const express = require('express');
const settingController = require('../controllers/settingController');

const router = express.Router();

router.get('/month/family/', settingController.viewMonthFamily );
router.get('/month/private/', settingController.viewMonthPrivate );
router.get('/category/family/', settingController.viewCategoryFamily );
router.get('/category/private/', settingController.viewCategoryPrivate );

module.exports = {
  router,
};