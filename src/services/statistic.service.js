const { Statistic } = require('../models');

const STATISTIC_LIMIT = 7;

const getOverallStatistic = async () => {
  return Statistic.findAll({ limit: STATISTIC_LIMIT, order: [['date', 'ASC']] });
};

const getTotalOfColumn = async (column) => {
  return Statistic.sum(column);
};

module.exports = {
  getOverallStatistic,
  getTotalOfColumn,
};
