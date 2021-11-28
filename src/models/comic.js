const Sequelize = require('sequelize');
const { statuses } = require('../constraints/approvalStatus');

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
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: '',
        },
        approval_status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: statuses[0],
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
      },
      {
        sequelize,
        tableName: 'comic',
        schema: 'public',
        timestamps: true,
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

module.exports = comic;
