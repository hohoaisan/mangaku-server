const express = require('express');
const validate = require('../../middlewares/validate');
const imageValidation = require('../../validations/image.validation');
const imageController = require('../../controllers/image.controller');
const { singleImageUpload } = require('../../middlewares/imageUpload');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/').post(auth(), singleImageUpload(), validate(imageValidation.createImage), imageController.createImage);

module.exports = router;
