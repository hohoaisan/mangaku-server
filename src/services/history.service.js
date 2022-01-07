const _ = require('lodash');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { ReadHistory, Comic, Chapter } = require('../models');
const comicQuery = require('../queries/comic.queries');

const withSequelizeSearch = require('../utils/withSequelizeSearch');

const createOrUpdateHistory = async (userId, chapterId) => {
  const current = await ReadHistory.findOne({
    where: {
      userId,
      chapterId,
    },
  });

  if (current) {
    await current.update({
      lastRead: Sequelize.Sequelize.fn('now'),
    });
    await current.save();
    return current;
  }

  const newRecord = await ReadHistory.create({
    userId,
    chapterId,
  });

  return newRecord;
};

const queryHistories = async (userId, options) => {
  const queryOptions = _.pick(options, ['page', 'limit', 'sortBy']);
  const { search } = _.pick(options, ['search']);
  const detailOptions = {
    ...queryOptions,
    where: {
      userId,
      lastRead: {
        [Op.eq]: Sequelize.literal(`(
          SELECT MAX
            ( "sRH"."lastRead" ) 
          FROM
            "public"."read_history" AS "sRH"
            LEFT OUTER JOIN "public"."chapter" AS "sC" ON "sRH"."chapterId" = "sC"."id" 
            AND ( "sC"."deletedAt" IS NULL )
          WHERE "sRH"."userId" = '${userId}' AND "sC"."comicId" = "chapter"."comicId"
      )`),
      },
    },
    order: [['lastRead', 'DESC']],
    subQuery: false,
    attributes: ['chapterId', 'userId', 'lastRead'],
    include: [
      {
        model: Chapter,
        as: 'chapter',
        attributes: ['comicId', 'id', 'number', 'name'],
        include: [
          {
            model: Comic,
            as: 'comic',
            ..._.pick(comicQuery.default, ['include', 'attributes']),
            ...withSequelizeSearch(search, ['title', 'description'])(),
          },
        ],
      },
    ],
  };
  const countQuery = {
    ...queryOptions,
    ..._.pick(detailOptions, ['where', 'order', 'subQuery']),
    include: [
      {
        model: Chapter,
        as: 'chapter',
        attributes: ['comicId'],
        include: [
          {
            model: Comic,
            as: 'comic',
            ...withSequelizeSearch(search, ['title', 'description'])(),
          },
        ],
      },
    ],
  };
  return ReadHistory.paginate(detailOptions, countQuery);
};

const getComicLastestRead = (userId, comicId) => {
  return ReadHistory.findOne({
    where: {
      userId,
      lastRead: {
        [Op.eq]: Sequelize.literal(`(
          SELECT MAX
            ( "sRH"."lastRead" ) 
          FROM
            "public"."read_history" AS "sRH"
            LEFT OUTER JOIN "public"."chapter" AS "sC" ON "sRH"."chapterId" = "sC"."id" 
            AND ( "sC"."deletedAt" IS NULL )
          WHERE "sRH"."userId" = '${userId}' AND "sC"."comicId" = "chapter"."comicId"
      )`),
      },
    },
    attributes: ['chapterId', 'userId', 'lastRead'],
    include: [
      {
        model: Chapter,
        as: 'chapter',
        where: {
          comicId,
        },
      },
    ],
  });
};

const deleteComicReadHistory = async (userId, comicId) => {
  return ReadHistory.sequelize.query(
    `DELETE FROM "public"."read_history" as "readHistory"
    USING "public"."comic" as "comic", "public"."chapter" as "chapter"
    WHERE "readHistory"."chapterId" = "chapter"."id"
    AND "chapter"."comicId" = "comic"."id"
    AND "comic"."id" = :comicId
    AND "readHistory"."userId" = :userId`,
    {
      replacements: { comicId, userId },
    }
  );
};

module.exports = {
  createOrUpdateHistory,
  queryHistories,
  getComicLastestRead,
  deleteComicReadHistory,
};
