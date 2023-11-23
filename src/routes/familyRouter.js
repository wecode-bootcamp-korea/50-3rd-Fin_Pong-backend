const express = require('express');
const router = express.Router();

const familyController = require('../controllers/familyController');
const { loginRequired } = require('../utils/auth');

router.post('/book', loginRequired, familyController.newBook);
router.post('/join', loginRequired, familyController.joinBook);
router.get('/auth-code', loginRequired ,familyController.getFamilyAuthCode)

module.exports.router = router;
