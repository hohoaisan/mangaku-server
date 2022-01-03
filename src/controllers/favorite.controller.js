const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { favoriteService } = require('../services');
const { flatComic } = require('./helpers');

const createFavorite = catchAsync(async (req, res) => {
  const { comicId } = req.body;
  const userId = req.user.id;
  const favorite = await favoriteService.createFavorite(userId, comicId);
  res.status(httpStatus.CREATED).send(favorite);
});

const getFavorites = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const options = pick(req.query, ['sortBy', 'page', 'limit', 'search']);
  const result = await favoriteService.queryFavorites(userId, options);
  if (result && result.data) {
    result.data = result.data.map((item) => {
      const mappedItem = item.toJSON();
      if (item.comic) {
        mappedItem.comic = flatComic(item.comic, ['covers']);
      }
      return mappedItem;
    });
  }
  res.send(result);
});

const getFavorite = catchAsync(async (req, res) => {
  const { comicId } = req.params;
  const userId = req.user.id;
  const favorite = await favoriteService.getFavorite(userId, comicId);
  if (!favorite) {
    return res.send(null);
  }
  res.send(favorite);
});

const deleteFavorite = catchAsync(async (req, res) => {
  const { comicId } = req.params;
  const userId = req.user.id;
  await favoriteService.deleteFavorite(userId, comicId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createFavorite,
  getFavorites,
  getFavorite,
  deleteFavorite,
};
