const Sequelize = require('sequelize');

class review extends Sequelize.Model {
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
        rating: {
          type: DataTypes.SMALLINT,
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'review',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'review_pkey',
            unique: true,
            fields: [{ name: 'comic' }, { name: 'user' }],
          },
        ],
      }
    );
    return review;
  }
}

module.exports = review;
