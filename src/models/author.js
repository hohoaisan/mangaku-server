const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { statuses } = require('../constraints/approvalStatus');
const plugins = require('./plugins');
const User = require('./user');

class author extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'user',
            key: 'id',
          },
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        approval_status: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: null,
          validate: {
            isIn: statuses,
          },
        },
        restricted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: 'author',
        schema: 'public',
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: 'author_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
        defaultScope: {
          attributes: {
            exclude: ['userId', 'createdAt', 'updatedAt', 'deletedAt', 'restricted', 'approval_status'],
          },
          where: {
            restricted: false,
            [Op.or]: [
              {
                userId: null,
                approval_status: null,
              },
              {
                userId: { [Op.not]: null },
                approval_status: 'approved',
              },
            ],
          },
        },
        scopes: {
          all: {
            include: { model: User, as: 'user' },
            paranoid: false,
          },
          visible: {
            include: { model: User, as: 'user' },
          },
          deleted: {
            include: { model: User, as: 'user' },
            where: {
              deletedAt: { [Op.not]: null },
            },
            paranoid: false,
          },
        },
      }
    );
    return author;
  }
}

plugins.paginate(author);

module.exports = author;
