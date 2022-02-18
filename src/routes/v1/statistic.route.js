const express = require('express');
const auth = require('../../middlewares/auth');
const statisticController = require('../../controllers/statistic.controller');

const router = express.Router();

router.route('/overall').get(auth(), statisticController.getStatisic);

module.exports = router;
