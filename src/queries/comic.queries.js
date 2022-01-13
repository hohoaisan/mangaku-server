const { Op } = require('sequelize');
const { status } = require('../constraints/approvalStatus');

module.exports = {
  default: {
    where: {
      [Op.and]: {
        [Op.or]: [
          {
            approval_status: null,
          },
          {
            approval_status: 'approved',
          },
        ],
      },
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
      exclude: ['deletedAt', 'approval_status'],
    },
  },
  detail: {
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
          where: {
            default: true,
          },
          attributes: ['default'],
        },
      },
    ],
    attributes: {
      exclude: ['deletedAt', 'approval_status'],
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
    where: {
      [Op.or]: [{ approval_status: status.APPROVED }, { approval_status: null }],
      deletedAt: null,
    },
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
  managePending: {
    where: {
      approval_status: status.PENDING,
      deletedAt: null,
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
  manageApproved: {
    where: {
      approval_status: status.APPROVED,
      deletedAt: null,
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
  manageRejected: {
    where: {
      approval_status: status.REJECTED,
      deletedAt: null,
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
