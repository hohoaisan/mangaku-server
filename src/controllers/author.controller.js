const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const withSequelizeSearch = require('../utils/withSequelizeSearch');
const pick = require('../utils/pick');
const { authorService } = require('../services');
const withScope = require('../utils/withScope');

const createAuthor = catchAsync(async (req, res) => {
  const author = await authorService.createAuthor(req.body);
  res.status(httpStatus.CREATED).send(author);
});

const getAuthors = catchAsync(async (req, res) => {
  let options = pick(req.query, ['sortBy', 'page', 'limit']);
  const { search, scope } = pick(req.query, ['search', 'scope']);
  // enable query scope with any user role with matched permission
  // otherwise fallback to defaultScope
  const queryScope = withScope(req.user, {
    [scope || 'visible']: 'manageAuthors',
  });
  options = withSequelizeSearch(search, ['name', 'description'])(options);
  const result = await authorService.queryAuthors(options, queryScope);
  res.send(result);
});

const getAuthor = catchAsync(async (req, res) => {
  // any role with matched permission will get the correct scope
  const queryScope = withScope(req.user, {
    all: 'manageAuthors',
  });
  const author = await authorService.getAuthorById(req.params.authorId, queryScope);
  if (!author) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Author not found');
  }
  res.send(author);
});

const updateAuthor = catchAsync(async (req, res) => {
  const updateBody = pick(req.body, ['name', 'description', 'restricted', 'approval_status']);
  const updateOptions = pick(req.body, ['restore']);
  const currentAuthor = await authorService.getAuthorById(req.params.authorId);
  if (!currentAuthor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Author not found');
  }
  if (updateOptions.restore) {
    await currentAuthor.restore();
  }
  const author = await currentAuthor.update(updateBody);
  res.send(author);
});

const deleteAuthor = catchAsync(async (req, res) => {
  await authorService.deleteAuthorById(req.params.authorId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAuthor,
  getAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
};
