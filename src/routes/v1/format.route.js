const express = require('express');
const validate = require('../../middlewares/validate');
const formatValidation = require('../../validations/format.validation');
const formatController = require('../../controllers/format.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(formatValidation.createFormat), formatController.createFormat)
  .get(validate(formatValidation.getFormats), formatController.getFormats);

router
  .route('/:formatId')
  .get(validate(formatValidation.getFormat), formatController.getFormat)
  .patch(validate(formatValidation.updateFormat), formatController.updateFormat)
  .delete(validate(formatValidation.deleteFormat), formatController.deleteFormat);

module.exports = router;
