const _ = require('lodash');
const { Op } = require('sequelize');
const { status } = require('../constraints/approvalStatus');
const { Page, Image, ReadHistory } = require('../models');

const defaultScope = ({ historyUserId } = {}) => {
  return {
    attributes: {
      exclude: ['comicId', 'deletedAt', 'updatedAt'],
    },
    ...(historyUserId && {
      include: [
        {
          model: ReadHistory,
          as: 'read_histories',
          where: {
            userId: historyUserId,
          },
          required: false,
        },
      ],
    }),
  };
};

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
  where: {
    [Op.or]: [{ approval_status: null }, { approval_status: status.APPROVED }],
  },
});
const managePending = () => ({
  paranoid: true,
  where: {
    approval_status: status.PENDING,
  },
});

const manageRejected = () => ({
  paranoid: true,
  where: {
    approval_status: status.REJECTED,
  },
});

const manageApproved = () => ({
  paranoid: true,
  where: {
    approval_status: status.APPROVED,
  },
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
  managePending,
  manageRejected,
  manageApproved,
};
