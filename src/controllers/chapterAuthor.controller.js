const _ = require('lodash');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { chapterService } = require('../services');
const chapterQueries = require('../queries/chapter.queries');
const matchScope = require('../middlewares/matchScope');

const { flatChapterPage, flatChapter } = require('./helpers');
const { status } = require('../constraints/approvalStatus');

const createComicChapter = catchAsync(async (req, res) => {
  const { comicId } = req.params;
  const chapterBody = {
    ...pick(req.body, ['number', 'name', 'volume', 'pages']),
    approval_status: status.PENDING,
  };
  const chapter = await chapterService.createComicChapter(comicId, chapterBody);
  res.status(httpStatus.CREATED).send(chapter);
});

const getComicChapter = [
  matchScope({
    manageDetail: [],
    detail: [],
  }),
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
    manageVisible: [],
    manageDeleted: [],
    managePending: [],
    manageApproved: [],
    manageRejected: [],
  }),
  catchAsync(async (req, res) => {
    const { comicId } = req.params;
    const { scope } = pick(req.query, ['scope']);
    let options = pick(req.query, ['sortBy', 'page', 'limit']);
    let scopedQueries = {};

    scopedQueries = chapterQueries[scope]();
    options = _.extend(options, scopedQueries);

    const result = await chapterService.queryComicChapters(comicId, options);

    if (result.data) {
      result.data = result.data.map((chapter) => flatChapter(chapter));
    }
    res.send(result);
  }),
];

const updateComicChapter = catchAsync(async (req, res) => {
  const { comicId, chapterId } = req.params;
  const queryOptions = chapterQueries.manageAll();
  const chapter = await chapterService.updateComicChapterById(comicId, chapterId, req.body, queryOptions);
  if (!chapter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chapter not found or had been deleted');
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
