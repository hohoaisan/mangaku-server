const { Op } = require('sequelize');

module.exports = {
  default: {
    where: {
      [Op.or]: [
        {
          approval_status: null,
        },
        {
          approval_status: 'approved',
        },
      ],
    },
    include: [
      {
        association: 'authors',
        attributes: ['name', 'id'],
        through: {
          attributes: [],
        },
      },
      {
        association: 'covers',
        attributes: ['id', 'url'],
        through: {
          where: {
            default: true,
          },
          attributes: ['default'],
        },
      },
    ],
    attributes: {
      exclude: ['deletedAt', 'approval_status', 'updatedAt'],
    },
  },
  manageAll: {
    paranoid: false,
  },
  manageUpdate: {
    include: [
      {
        association: 'covers',
        attributes: ['id', 'url'],
        through: {
          where: {
            default: true,
          },
          attributes: ['default'],
        },
      },
    ],
    attributes: {
      exclude: ['deletedAt', 'approval_status', 'updatedAt'],
    },
    paranoid: false,
  },
  manageDetail: {
    paranoid: false,
    include: [
      {
        association: 'authors',
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
      },
      {
        association: 'genres',
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
      },
      {
        association: 'formats',
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
      },
      {
        association: 'covers',
        attributes: ['id', 'url'],
        through: {
          attributes: ['default'],
        },
      },
    ],
  },
  manageVisible: {
    include: [
      {
        association: 'authors',
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
      },
      {
        association: 'covers',
        attributes: ['id', 'url'],
        through: {
          where: {
            default: true,
          },
          attributes: ['default'],
        },
      },
    ],
  },
  manageDeleted: {
    where: {
      deletedAt: { [Op.not]: null },
    },
    paranoid: false,
    include: [
      {
        association: 'authors',
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
      },
      {
        association: 'covers',
        attributes: ['id', 'url'],
        through: {
          where: {
            default: true,
          },
          attributes: ['default'],
        },
      },
    ],
  },
};
