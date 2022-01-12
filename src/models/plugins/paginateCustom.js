const sortByConvert = require('../../utils/sortByConvert');
// https://github.com/eclass/sequelize-paginate/
/**
 * Class to paginate sequelite results.
 */

/** @typedef {import('sequelize').Model} Model */
/**
 * Method to append paginate method to Model.
 *
 * @param {Model} Model - Sequelize Model.
 * @returns {*} -
 * @example
 * const sequelizePaginate = require('sequelize-paginate')
 *
 * sequelizePaginate.paginate(MyModel)
 */
const paginate = (Model) => {
  /**
   * @typedef {Object} Paginate Sequelize query options
   * @property {number} [paginate=10] Results per page
   * @property {number} [page=1] Number of page
   */
  /**
   * @typedef {import('sequelize').FindOptions & Paginate} paginateOptions
   */
  /**
   * The paginate result
   * @typedef {Object} PaginateResult
   * @property {Array} docs Docs
   * @property {number} pages Number of page
   * @property {number} total Total of docs
   */
  /**
   * Pagination.
   *
   * @param {paginateOptions} [params] - Options to filter query.
   * @returns {Promise<PaginateResult>} Total pages and docs.
   * @example
   * const { docs, pages, total } = await MyModel.paginate({ page: 1, paginate: 25 })
   * @memberof Model
   */
  const pagination = async function (params = {}, countParams) {
    const options = { ...params };
    const countOptions = countParams || options;

    let total = await this.count(countOptions);

    if (options.group !== undefined) {
      // @ts-ignore
      total = total.length;
    }
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    let page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;

    const pages = Math.ceil(total / limit);
    if (page > pages && pages !== 0) page = pages;

    options.limit = limit;
    options.offset = limit * (page - 1) >= 0 ? limit * (page - 1) : 0;
    // Sorting
    if (options.sortBy) {
      const sortingCriteria = sortByConvert(options.sortBy);
      options.order = sortingCriteria;
    } else {
      options.order = [];
    }
    /* eslint-enable no-console */
    if (params.order) options.order = params.order;
    const data = await this.findAll({
      ...options,
    });
    return { page, pages, limit, total, data };
  };
  const instanceOrModel = Model.Instance || Model;
  // @ts-ignore
  instanceOrModel.customPaginate = pagination;
};

module.exports = paginate;
