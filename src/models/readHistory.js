const Sequelize = require('sequelize');

class readHistory extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        chapter: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'chapter',
            key: 'id',
          },
        },
        user: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'user',
            key: 'id',
          },
        },
        lastread: {
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
            fields: [{ name: 'chapter' }, { name: 'user' }],
          },
        ],
      }
    );
    return readHistory;
  }
}

module.exports = readHistory;
