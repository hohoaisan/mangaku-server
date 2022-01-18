const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const withSequelizeSearch = require('../utils/withSequelizeSearch');
const pick = require('../utils/pick');
const { genreService } = require('../services');
const strings = require('../constraints/strings');

const {
  genre: { errors },
} = strings;

const createGenre = catchAsync(async (req, res) => {
  const existingGenre = await genreService.getGenreByKey(req.body.key);
  if (existingGenre) {
    throw new ApiError(httpStatus.NOT_FOUND, errors.keyExist);
  }
  const genre = await genreService.createGenre(req.body);
  res.status(httpStatus.CREATED).send(genre);
});

const getGenres = catchAsync(async (req, res) => {
  const options = pick(req.query, ['search']);
  const result = await genreService.queryGenres(withSequelizeSearch(options.search, ['key', 'name', 'description'])({}));
  res.send(result);
});

const getGenre = catchAsync(async (req, res) => {
  const genre = await genreService.getGenreById(req.params.genreId);
  if (!genre) {
    throw new ApiError(httpStatus.NOT_FOUND, errors.notFound);
  }
  res.send(genre);
});

const updateGenre = catchAsync(async (req, res) => {
  const currentGenre = await genreService.getGenreById(req.params.genreId);
  if (!currentGenre) {
    throw new ApiError(httpStatus.NOT_FOUND, errors.notFound);
  }
  const existingGenre = await genreService.getGenreByKey(req.body.key, { excludeKey: currentGenre.key });
  if (existingGenre) {
    throw new ApiError(httpStatus.NOT_FOUND, errors.keyExist);
  }
  const genre = await currentGenre.update(req.body);
  res.send(genre);
});

const deleteGenre = catchAsync(async (req, res) => {
  await genreService.deleteGenreById(req.params.genreId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createGenre,
  getGenres,
  getGenre,
  updateGenre,
  deleteGenre,
};
