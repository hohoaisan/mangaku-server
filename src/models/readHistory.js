const Sequelize = require('sequelize');
const plugins = require('./plugins');

class readHistory extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        chapterId: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'chapter',
            key: 'id',
          },
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'user',
            key: 'id',
          },
        },
        lastRead: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.fn('now'),
        },
      },
      {
        sequelize,
        tableName: 'read_history',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'read_history_pkey',
            unique: true,
            fields: [{ name: 'chapterId' }, { name: 'userId' }],
          },
        ],
      }
    );
    return readHistory;
  }
}

plugins.paginateCustom(readHistory);

module.exports = readHistory;
