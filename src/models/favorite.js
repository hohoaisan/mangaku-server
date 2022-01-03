const Sequelize = require('sequelize');
const plugins = require('./plugins');

class favorite extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        comicId: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'comic',
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
            fields: [{ name: 'comicId' }, { name: 'userId' }],
          },
        ],
      }
    );
    return favorite;
  }
}

// add plugin to model
plugins.paginate(favorite);

module.exports = favorite;
