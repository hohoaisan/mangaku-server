const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const withSequelizeSearch = require('../utils/withSequelizeSearch');
const pick = require('../utils/pick');
const { formatService } = require('../services');

const createFormat = catchAsync(async (req, res) => {
  const existingFormat = await formatService.getFormatByKey(req.body.key);
  if (existingFormat) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Format key has already existed');
  }
  const format = await formatService.createFormat(req.body);
  res.status(httpStatus.CREATED).send(format);
});

const getFormats = catchAsync(async (req, res) => {
  const options = pick(req.query, ['search']);
  const result = await formatService.queryFormats(withSequelizeSearch(options.search, ['key', 'name', 'description'])({}));
  res.send(result);
});

const getFormat = catchAsync(async (req, res) => {
  const format = await formatService.getFormatById(req.params.formatId);
  if (!format) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Format not found');
  }
  res.send(format);
});

const updateFormat = catchAsync(async (req, res) => {
  const currentFormat = await formatService.getFormatById(req.params.formatId);
  if (!currentFormat) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Format not found');
  }
  const existingFormat = await formatService.getFormatByKey(req.body.key, { excludeKey: currentFormat.key });
  if (existingFormat) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Format key has already existed');
  }
  const format = await currentFormat.update(req.body);
  res.send(format);
});

const deleteFormat = catchAsync(async (req, res) => {
  await formatService.deleteFormatById(req.params.formatId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createFormat,
  getFormats,
  getFormat,
  updateFormat,
  deleteFormat,
};
