const Sequelize = require('sequelize');

class Statistic extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          primaryKey: true,
        },
        favoriteCount: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        reviewCount: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        viewCount: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        commentCount: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        tableName: 'statistic',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'statistic_pkey',
            unique: true,
            fields: [{ name: 'date' }],
          },
        ],
      }
    );
    return Statistic;
  }
}

module.exports = Statistic;
