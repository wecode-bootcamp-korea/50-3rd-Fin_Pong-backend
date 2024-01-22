const express = require('express');
const router = express.Router();

const familyController = require('../controllers/familyController');
const { loginRequired } = require('../utils/auth');
const { usersUpdateFilter } = require('../utils/updateFilter');
router.use(loginRequired);

router.post('/book', familyController.postFamily);
router.post('/join', familyController.postUsersFamily);
router.get('/auth-code', familyController.getFamilyAuthCode);

module.exports.router = router;
