const _ = require('lodash');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { chapterService } = require('../services');
const chapterQueries = require('../queries/chapter.queries');
const matchScope = require('../middlewares/matchScope');

const { flatChapterPage } = require('./helpers');

const createComicChapter = catchAsync(async (req, res) => {
  const { comicId } = req.params;
  const chapterBody = pick(req.body, ['number', 'name', 'volume', 'pages']);
  const chapter = await chapterService.createComicChapter(comicId, chapterBody);
  res.status(httpStatus.CREATED).send(chapter);
});

const getComicChapter = [
  matchScope(
    {
      manageDetail: ['manageComics'],
      detail: [],
    },
    'detail'
  ),
  catchAsync(async (req, res) => {
    const { comicId, chapterId } = req.params;
    const { scope } = pick(req.query, ['scope']);
    const options = chapterQueries[scope]();
    let chapter = await chapterService.getChapterByIdAndComicId(chapterId, comicId, options);
    if (!chapter) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Chapter not found or had been deleted');
    }
    chapter = chapter.toJSON();
    if (chapter && chapter.pages) {
      chapter.pages = chapter.pages.map((page) => flatChapterPage(page));
    }
    res.status(httpStatus.CREATED).send(chapter);
  }),
];

const getComicChapters = [
  matchScope({
    manageVisible: ['manageComics'],
    manageDeleted: ['manageComics'],
  }),
  catchAsync(async (req, res) => {
    const { comicId } = req.params;
    const { scope } = pick(req.query, ['scope']);
    let options = pick(req.query, ['sortBy', 'page', 'limit']);
    options = _.extend(options, chapterQueries[scope]());
    const result = await chapterService.queryComicChapters(comicId, options);
    res.send(result);
  }),
];

const updateComicChapter = catchAsync(async (req, res) => {
  const { comicId, chapterId } = req.params;
  const updateOptions = pick(req.body, ['restore']);
  const queryOptions = chapterQueries.manageAll();
  const chapter = await chapterService.updateComicChapterById(comicId, chapterId, req.body, queryOptions);
  if (!chapter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chapter not found or had been deleted');
  }
  if (updateOptions.restore) {
    await chapter.restore();
  }
  res.send(chapter);
});

const deleteComicChapter = catchAsync(async (req, res) => {
  const { comicId, chapterId } = req.params;
  await chapterService.deleteComicChapterById(comicId, chapterId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createComicChapter,
  getComicChapter,
  getComicChapters,
  deleteComicChapter,
  updateComicChapter,
};
