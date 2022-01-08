const Sequelize = require('sequelize');
const { statuses } = require('../constraints/approvalStatus');
const plugins = require('./plugins');

class comic extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: '',
        },
        approval_status: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: null,
          validate: {
            isIn: statuses,
          },
        },
        rating: {
          type: DataTypes.DECIMAL,
          allowNull: true,
          defaultValue: null,
        },
        numFavorites: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        viewCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        tableName: 'comic',
        schema: 'public',
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: 'comic_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
    return comic;
  }
}

plugins.paginate(comic);

module.exports = comic;
