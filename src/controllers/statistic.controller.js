const catchAsync = require('../utils/catchAsync');
const { statisticService } = require('../services');

const getStatisic = catchAsync(async (req, res) => {
  const dates = await statisticService.getOverallStatistic();
  const totalViewCount = await statisticService.getTotalOfColumn('viewCount');
  const totalCommentCount = await statisticService.getTotalOfColumn('commentCount');
  res.send({
    total: {
      viewCount: totalViewCount,
      commentCount: totalCommentCount,
    },
    dates,
  });
});

module.exports = {
  getStatisic,
};
