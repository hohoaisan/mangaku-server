/* eslint-disable no-console */
const cron = require('node-cron');
const { Op } = require('sequelize');
const sequelize = require('../../models/db');

const { Favorite, Review, Comic, Comment, Statistic } = require('../../models');

const MAX_RETRY = 5;
let CURRENT_ATTEMPT = 0;

const getTotal = async () => {
  const favoriteCount = await Favorite.count();
  const reviewCount = await Review.count();
  const viewCount = await Comic.sum('viewCount');
  const commentCount = await Comment.count();
  return {
    favoriteCount,
    reviewCount,
    viewCount,
    commentCount,
  };
};

const getStatiticTotal = async () => {
  const condition = {
    where: {
      date: { [Op.lt]: new Date().toString() },
    },
  };
  const favoriteCount = await Statistic.sum('favoriteCount', condition);
  const reviewCount = await Statistic.sum('reviewCount', condition);
  const viewCount = await Statistic.sum('viewCount', condition);
  const commentCount = await Statistic.sum('commentCount', condition);
  return {
    favoriteCount,
    reviewCount,
    viewCount,
    commentCount,
  };
};

const getStatisticToday = async () => {
  const total = await getTotal();
  const totalStatistic = await getStatiticTotal();
  return {
    favoriteCount: total.favoriteCount - totalStatistic.favoriteCount,
    reviewCount: total.reviewCount - totalStatistic.reviewCount,
    viewCount: total.viewCount - totalStatistic.viewCount,
    commentCount: total.commentCount - totalStatistic.commentCount,
  };
};

const worker = async () => {
  await sequelize.authenticate();
  const today = new Date();
  const record = { date: today, ...(await getStatisticToday()) };
  await Statistic.create(record, {
    ignoreDuplicates: true,
  });
};

const jobFunction = async function () {
  console.log('Job starts');
  try {
    await worker();
    console.log('Job done');
    CURRENT_ATTEMPT = 0;
  } catch (err) {
    console.log(err);
    if (CURRENT_ATTEMPT <= MAX_RETRY) {
      await jobFunction();
      CURRENT_ATTEMPT += 1;
    }
  }
};

cron.schedule('00 55 23 * * *', jobFunction, {
  scheduled: true,
  timezone: 'Asia/Ho_Chi_Minh',
});
