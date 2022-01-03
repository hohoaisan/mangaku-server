const express = require('express');
const validate = require('../../middlewares/validate');
const favoriteValidation = require('../../validations/favorite.validation');

const favoriteController = require('../../controllers/favorite.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(favoriteValidation.createFavorite), favoriteController.createFavorite)
  .get(auth(), validate(favoriteValidation.getFavorites), favoriteController.getFavorites);

router
  .route('/:comicId')
  .get(auth(), validate(favoriteValidation.getFavorite), favoriteController.getFavorite)
  .delete(auth(), validate(favoriteValidation.deleteFavorite), favoriteController.deleteFavorite);

module.exports = router;
