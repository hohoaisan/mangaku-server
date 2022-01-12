const express = require('express');
const validate = require('../../middlewares/validate');
const authorValidation = require('../../validations/author.validation');
const { authorController } = require('../../controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(validate(authorValidation.createAuthor), authorController.createAuthor)
  .get(auth({ anonymous: true }), validate(authorValidation.getAuthors), authorController.getAuthors);

router
  .route('/:authorId')
  .get(auth({ anonymous: true }), validate(authorValidation.getAuthor), authorController.getAuthor)
  .patch(auth('manageAuthors'), validate(authorValidation.updateAuthor), authorController.updateAuthor)
  .delete(auth('manageAuthors'), validate(authorValidation.deleteAuthor), authorController.deleteAuthor);

module.exports = router;
