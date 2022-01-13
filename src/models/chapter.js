const Sequelize = require('sequelize');
const { statuses } = require('../constraints/approvalStatus');
const plugins = require('./plugins');

class chapter extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        comicId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'comic',
            key: 'id',
          },
        },
        number: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        approval_status: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: null,
          validate: {
            isIn: [statuses],
          },
        },
        numPages: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        volume: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        tableName: 'chapter',
        schema: 'public',
        paranoid: true,
        timestamps: true,
        indexes: [
          {
            name: 'chapter_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
    return chapter;
  }
}

plugins.paginate(chapter);

module.exports = chapter;
