const Sequelize = require('sequelize');

class genre extends Sequelize.Model {
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
      },
      {
        sequelize,
        tableName: 'genre',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'genre_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
    return genre;
  }
}

module.exports = genre;
