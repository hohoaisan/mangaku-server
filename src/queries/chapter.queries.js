const _ = require('lodash');
const { Op } = require('sequelize');
const { Page, Image } = require('../models');

const defaultScope = () => ({
  attributes: {
    exclude: ['comicId', 'deletedAt', 'updatedAt'],
  },
});

const detail = () => ({
  include: [
    {
      model: Page,
      as: 'pages',
      include: [
        {
          model: Image,
          as: 'image',
          attributes: {
            exclude: ['createdAt', 'deletedAt', 'updatedAt', 'uploader', 'id'],
          },
        },
      ],
      attributes: {
        exclude: ['chapterId'],
      },
    },
  ],
  order: [['pages', 'order', 'ASC']],
  attributes: {
    exclude: ['deletedAt', 'updatedAt'],
  },
});

const manageDetail = () => ({
  ..._.omit(detail(), ['attributes']),
  paranoid: false,
});

const manageAll = () => ({
  paranoid: false,
});

const manageVisible = () => ({
  paranoid: true,
});

const manageDeleted = () => ({
  where: {
    deletedAt: { [Op.not]: null },
  },
  paranoid: false,
});

module.exports = {
  defaultScope,
  detail,
  manageDetail,
  manageAll,
  manageVisible,
  manageDeleted,
};
