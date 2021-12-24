const sortByConvert = (sortBy) => {
  if (sortBy) {
    const SORT_KEYS = ['ASC', 'DESC'];
    const sortingCriteria = [];
    sortBy.split(',').forEach((sortOption) => {
      const [key, order] = sortOption.split(':');
      sortingCriteria.push([key, SORT_KEYS.includes(order.toUpperCase()) ? order : SORT_KEYS[0]]);
    });
    return sortingCriteria;
  }
  return null;
};

module.exports = sortByConvert;
