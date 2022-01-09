const Sequelize = require('sequelize');

class review extends Sequelize.Model {
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
        rating: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isInt: true,
            max: 5,
            min: 1,
          },
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
            fields: [{ name: 'comicId' }, { name: 'userId' }],
          },
        ],
      }
    );
    return review;
  }
}

module.exports = review;
