// const Sequelize = require('sequelize');
const _ = require('lodash');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const withSequelizeSearch = require('../utils/withSequelizeSearch');
const pick = require('../utils/pick');
const { comicService } = require('../services');
// const mapRole = require('../../middlewares/mapRole');
const matchScope = require('../middlewares/matchScope');

const { flatComic } = require('./helpers');

const comicQueries = require('../queries/comic.queries');

const createComic = catchAsync(async (req, res) => {
  const comic = await comicService.createComic(req.body);
  res.status(httpStatus.CREATED).send(comic);
});

const getComics = [
  matchScope(
    {
      manageVisible: ['manageComics'],
      manageDeleted: ['manageComics'],
    },
    'default'
  ),
  catchAsync(async (req, res) => {
    const { scope, search } = pick(req.query, ['scope', 'search']);
    let options = pick(req.query, ['sortBy', 'page', 'limit']);
    options = _.extend(options, comicQueries[scope]);
    options = withSequelizeSearch(search, ['title', 'description'])(options);
    const result = await comicService.queryComics(options);
    if (result && result.data) {
      result.data = result.data.map((comic) => flatComic(comic, ['covers']));
    }
    res.send(result);
  }),
];

const getComic = [
  matchScope(
    {
      manageDetail: ['manageComics'],
      detail: [],
    },
    'default'
  ),
  catchAsync(async (req, res) => {
    const { scope } = pick(req.query, ['scope']);
    const comic = await comicService.getComicById(req.params.comicId, comicQueries[scope]);
    if (!comic) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Comic not found or had been deleted');
    }
    res.send(flatComic(comic));
  }),
];

const updateComic = catchAsync(async (req, res) => {
  const updateOptions = pick(req.body, ['restore']);
  const queryOptions = comicQueries.manageUpdate;
  const comic = await comicService.updateComicById(req.params.comicId, req.body, queryOptions);
  if (!comic) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comic not found or had been deleted');
  }
  if (updateOptions.restore) {
    await comic.restore();
  }
  res.send(flatComic(comic));
});

const deleteComic = catchAsync(async (req, res) => {
  await comicService.deleteComicById(req.params.comicId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createComic,
  getComics,
  getComic,
  updateComic,
  deleteComic,
};
