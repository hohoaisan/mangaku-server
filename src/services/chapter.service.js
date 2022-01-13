/* eslint-disable camelcase */
const _ = require('lodash');
const { Op } = require('sequelize');
const sequelize = require('../models/db');
const { Chapter, Page } = require('../models');

const getChapterById = async (id, options) => {
  return Chapter.findByPk(id, options);
};

const getChapterByIdAndComicId = async (id, comicId, options) => {
  return Chapter.findOne({
    ..._.extend(
      {
        where: {
          id,
          comicId,
        },
      },
      options
    ),
  });
};

const createComicChapter = async (comicId, createBody, options) => {
  const comic = await Chapter.create(
    {
      ...createBody,
      comicId,
      numPages: (createBody.pages && createBody.pages.length) || 0,
    },
    {
      ...options,
      include: [{ model: Page, as: 'pages' }],
    }
  );
  return comic.toJSON();
};

const queryComicChapters = async (comicId, options) => {
  const result = await Chapter.paginate(
    _.extend(
      {
        where: {
          comicId,
        },
        attributes: {
          exclude: ['comicId'],
        },
        order: [
          ['number', 'DESC'],
          ['volume', 'DESC'],
        ],
      },
      {
        ...options,
        where: {
          comicId,
          ...options.where,
        },
      }
    )
  );
  return result;
};

const deleteComicChapterById = async (comicId, chapterId) => {
  const chapter = await getChapterByIdAndComicId(chapterId, comicId);
  if (!chapter) {
    throw new Error('Chapter not found or has been deleted');
  }
  await chapter.destroy();
  return chapter;
};

const updateComicChapterById = async (comicId, chapterId, updateBody, options) => {
  const chapterBody = _.pick(updateBody, ['number', 'name', 'volume', 'approval_status']);
  const chapter = await getChapterByIdAndComicId(chapterId, comicId, options);
  if (!chapter) {
    throw new Error('Chapter not found or has been deleted');
  }
  const transaction = await sequelize.transaction();
  try {
    if (updateBody.pages && updateBody.pages.length) {
      const { pages } = updateBody;
      const destroyPageList = [];
      const currentPages = await Page.findAll({
        where: {
          chapterId: chapter.id,
        },
      });

      await Promise.all(
        currentPages.map(
          (pageInDb) =>
            // eslint-disable-next-line no-async-promise-executor
            new Promise(async (resolve, reject) => {
              try {
                const pageInUpdate = pages.find((page) => page.imageId === pageInDb.imageId);
                if (!pageInUpdate) {
                  destroyPageList.push(pageInDb.imageId);
                  resolve();
                }
                const isUpdateOrder = pageInUpdate.order !== pageInDb.order;
                if (isUpdateOrder) {
                  await pageInDb.update(
                    {
                      order: pageInUpdate.order,
                    },
                    { transaction }
                  );
                }
                resolve();
              } catch (err) {
                reject(err);
              }
            })
        )
      );

      const bulkCreateBody = pages.map((page) => ({ ...page, chapterId: chapter.id }));
      await Page.bulkCreate(bulkCreateBody, {
        transaction,
        ignoreDuplicates: true,
      });

      if (destroyPageList && destroyPageList.length) {
        await Page.destroy(
          {
            where: { chapterId: chapter.id, imageId: { [Op.in]: destroyPageList } },
          },
          {
            transaction,
          }
        );
      }
    }
    await chapter.update(chapterBody, { transaction });
    await chapter.save();
    await transaction.commit();
    return chapter;
  } catch (err) {
    await transaction.rollback();
    throw new Error(err);
  }
};

const getNextChapterOf = async (chapter) => {
  // TODO: get based on approval_status, currently get all non deleted record
  return Chapter.findOne({
    where: {
      comicId: chapter.comicId,
      number: { [Op.gte]: chapter.number },
      volume: { [Op.gte]: chapter.volume },
      createdAt: { [Op.gte]: chapter.createdAt },
      id: { [Op.not]: chapter.id },
    },
    order: [
      ['number', 'ASC'],
      ['volume', 'ASC'],
      ['createdAt', 'ASC'],
    ],
    attributes: {
      exclude: ['deletedAt', 'updatedAt'],
    },
  });
};

const getPrevChapterOf = async (chapter) => {
  // TODO: get based on approval_status, currently get all non deleted record
  return Chapter.findOne({
    where: {
      comicId: chapter.comicId,
      number: { [Op.lte]: chapter.number },
      volume: { [Op.lte]: chapter.volume },
      createdAt: { [Op.lte]: chapter.createdAt },
      id: { [Op.not]: chapter.id },
    },
    order: [
      ['number', 'DESC'],
      ['volume', 'DESC'],
      ['createdAt', 'DESC'],
    ],
    attributes: {
      exclude: ['deletedAt', 'updatedAt'],
    },
  });
};

module.exports = {
  getChapterById,
  getChapterByIdAndComicId,
  createComicChapter,
  queryComicChapters,
  deleteComicChapterById,
  updateComicChapterById,
  getNextChapterOf,
  getPrevChapterOf,
};
