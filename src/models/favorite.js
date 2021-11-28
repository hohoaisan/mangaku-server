const Sequelize = require('sequelize');

class favorite extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        comic: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'comic',
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
        subscribe: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: 'favorite',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'favorite_pkey',
            unique: true,
            fields: [{ name: 'comic' }, { name: 'user' }],
          },
        ],
      }
    );
    return favorite;
  }
}

module.exports = favorite;
