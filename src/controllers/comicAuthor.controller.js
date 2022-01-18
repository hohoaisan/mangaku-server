// const Sequelize = require('sequelize');
const _ = require('lodash');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const withSequelizeSearch = require('../utils/withSequelizeSearch');
const pick = require('../utils/pick');
const { comicService, authorService } = require('../services');
const { enumRole } = require('../config/roles');
const { status } = require('../constraints/approvalStatus');
const matchScope = require('../middlewares/matchScope');

const { flatComic } = require('./helpers');

const comicQueries = require('../queries/comic.queries');
const strings = require('../constraints/strings');

const {
  common: { errors: commonErrors },
  author: { errors: authorErrors },
  comic: { errors },
} = strings;

const checkUserAuthor = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  if (req.user.role !== enumRole.AUTHOR) {
    throw new ApiError(httpStatus.BAD_REQUEST, authorErrors.mustBeAuthor);
  }
  const author = await authorService.getAuthorByUserId(userId);
  if (!author) {
    throw new ApiError(httpStatus.BAD_REQUEST, authorErrors.mustBeAuthor);
  }
  if (!author.approval_status === status.APPROVED) {
    throw new ApiError(httpStatus.BAD_REQUEST, authorErrors.mustBeAuthor);
  }
  if (author.restricted) {
    throw new ApiError(httpStatus.BAD_REQUEST, authorErrors.restricted);
  }
  res.author = author;
  next();
});

const createComic = [
  checkUserAuthor,
  catchAsync(async (req, res) => {
    const userId = req.user.id;
    const comic = await comicService.createComic({
      ...req.body,
      userId,
      approval_status: status.PENDING,
      comic_authors: [
        {
          authorId: res.author.id,
        },
      ],
    });
    res.status(httpStatus.CREATED).send(comic);
  }),
];

const getComics = [
  checkUserAuthor,
  matchScope(
    {
      manageVisible: [],
      managePending: [],
      manageApproved: [],
      manageDeleted: [],
      manageRejected: [],
    },
    'default'
  ),
  catchAsync(async (req, res) => {
    const authorId = res.author.id;
    const { scope, search } = pick(req.query, ['scope', 'search']);
    let options = pick(req.query, ['sortBy', 'page', 'limit']);
    options = _.extend(options, comicQueries[scope]);
    options = withSequelizeSearch(search, ['title', 'description'])(options);
    const paginateOptions = {
      ..._.omit(options, ['include']),
      include: [
        {
          association: 'authors',
          where: {
            id: authorId,
          },
          attributes: ['id', 'name'],
        },
      ],
    };
    const result = await comicService.customQueryComics(options, paginateOptions);
    if (result && result.data) {
      result.data = result.data.map((comic) => flatComic(comic, ['covers']));
    }
    res.send(result);
  }),
];

const getComic = [
  checkUserAuthor,
  matchScope(
    {
      manageDetail: [],
    },
    'default'
  ),
  catchAsync(async (req, res) => {
    const { scope } = pick(req.query, ['scope']);
    const comic = await comicService.getComicById(req.params.comicId, comicQueries[scope]);
    if (!comic) {
      throw new ApiError(httpStatus.NOT_FOUND, errors.notFound);
    }
    res.send(flatComic(comic));
  }),
];

const updateComic = [
  checkUserAuthor,
  catchAsync(async (req, res) => {
    const queryOptions = comicQueries.manageUpdate;
    const updateBody = {
      ...req.body,
      comic_authors: [
        {
          authorId: res.author.id,
        },
      ],
    };
    const comic = await comicService.updateComicById(req.params.comicId, updateBody, queryOptions);
    if (!comic) {
      throw new ApiError(httpStatus.NOT_FOUND, errors.notFound);
    }
    res.send(flatComic(comic));
  }),
];

const deleteComic = [
  checkUserAuthor,
  catchAsync(async (req, res) => {
    const { comicId, authorId } = req.params;
    const comicAuthor = comicService.getComicByAuthor(comicId, authorId);
    if (!comicAuthor) {
      throw new ApiError(httpStatus.BAD_REQUEST, commonErrors.noPerm);
    }
    await comicService.deleteComicById(comicId);
    res.status(httpStatus.NO_CONTENT).send();
  }),
];

module.exports = {
  createComic,
  getComics,
  getComic,
  updateComic,
  deleteComic,
};
