const express = require('express');
const auth = require('../../middlewares/auth');
const { profileController } = require('../../controllers');

const router = express.Router();

router.route('/').get(auth(), profileController.getProfile);
router.route('/author').get(auth(), profileController.getUserAuthor).post(auth(), profileController.becomeAuthorCreate);

module.exports = router;
