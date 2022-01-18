const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { Format } = require('../models');
const ApiError = require('../utils/ApiError');
const strings = require('../constraints/strings');

const {
  format: { errors },
} = strings;
/**
 * Get format by id
 * @param {ObjectId} id
 * @returns {Promise<Format>}
 */
const getFormatById = async (id, options) => {
  return Format.findByPk(id, options);
};

/**
 * Get format by id
 * @param {ObjectId} key
 * @returns {Promise<Format>}
 */
const getFormatByKey = async (key, options = {}) => {
  const { excludeKey, ...restOptions } = options;
  if (excludeKey) {
    return Format.findOne({ where: { key: { [Op.eq]: key, [Op.not]: excludeKey } }, ...options });
  }
  return Format.findOne({ where: { key }, ...restOptions });
};

/**
 * Create a format
 * @param {Object} formatBody
 * @returns {Promise<Format>}
 */

const createFormat = async (formatBody) => {
  const format = await Format.create(formatBody);
  return format.toJSON();
};

/**
 * Query for formats
 * @returns {Promise<QueryResult>}
 */
const queryFormats = async (options) => {
  const formats = await Format.findAll(options);
  return formats;
};

/**
 * Update format by id
 * @param {ObjectId} formatId
 * @param {Object} updateBody
 * @returns {Promise<Format>}
 */
const updateFormatById = async (formatId, updateBody) => {
  const format = await getFormatById(formatId);
  if (!format) {
    throw new ApiError(httpStatus.NOT_FOUND, errors.notFound);
  }
  format.set(updateBody);
  await format.save();
  return format;
};

/**
 * Delete format by id
 * @param {ObjectId} formatId
 * @returns {Promise<Format>}
 */
const deleteFormatById = async (formatId) => {
  const format = await getFormatById(formatId);
  if (!format) {
    throw new ApiError(httpStatus.NOT_FOUND, errors.notFound);
  }
  await format.destroy();
  return format;
};

module.exports = {
  createFormat,
  queryFormats,
  getFormatById,
  getFormatByKey,
  updateFormatById,
  deleteFormatById,
};
