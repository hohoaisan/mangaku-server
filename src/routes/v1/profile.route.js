const express = require('express');
const auth = require('../../middlewares/auth');
const profileController = require('../../controllers/profile.controller');

const router = express.Router();

router.route('/').get(auth(), profileController.getProfile);

module.exports = router;
