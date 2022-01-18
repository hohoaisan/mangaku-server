const _ = require('lodash');
const httpStatus = require('http-status');

const { historyService, comicService, chapterService } = require('../services');
const { viewCountLimiter } = require('../middlewares/rateLimiter');

const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { flatComic } = require('./helpers');
const strings = require('../constraints/strings');

const {
  comic: { errors: comicErrors },
  chapter: { errors: chapterErrors },
  history: { errors },
} = strings;

const getComicLastRead = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { comicId } = req.params;
  const history = await historyService.getComicLastRead(userId, comicId);
  if (!history) {
    throw new ApiError(httpStatus.BAD_REQUEST, errors.notInHistory);
  }

  res.send(history);
});

const deleteComicReadHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { comicId } = req.params;
  const comic = comicService.getComicById(comicId);
  if (!comic) {
    throw new ApiError(httpStatus.BAD_REQUEST, comicErrors.notFound);
  }
  await historyService.deleteComicReadHistory(userId, comicId);
  res.status(httpStatus.OK).send();
});

const createorUpdateChapterHistory = [
  catchAsync(async (req, res, next) => {
    const { comicId, chapterId } = req.params;
    const chapter = chapterService.getChapterByIdAndComicId(chapterId, comicId);
    if (!chapter) {
      throw new ApiError(httpStatus.BAD_REQUEST, chapterErrors.notBelongComic);
    }

    if (req.user) {
      const userId = req.user.id;
      await historyService.createOrUpdateHistory(userId, chapterId);
    }
    next();
  }),
  viewCountLimiter,
  catchAsync(async (req, res) => {
    const { comicId } = req.params;
    await comicService.increaseViewCount(comicId);
    res.status(httpStatus.CREATED).send();
  }),
];

const getComicReadHistories = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const options = _.pick(req.query, ['sortBy', 'page', 'limit', 'search']);
  const history = await historyService.queryHistories(userId, options);
  if (history.data) {
    history.data = history.data.map((historyItem) => ({
      ..._.pick(historyItem, ['lastRead']),
      chapter: _.pick(historyItem.chapter, ['id', 'number', 'name']),
      comic: flatComic(historyItem.chapter.comic, ['covers']),
    }));
  }
  res.send(history);
});

module.exports = {
  getComicLastRead,
  createorUpdateChapterHistory,
  getComicReadHistories,
  deleteComicReadHistory,
};
