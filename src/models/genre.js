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
        key: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'genre',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'genre_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
    super.beforeSave((g) => {
      if (g.key) {
        // eslint-disable-next-line no-param-reassign
        g.key = g.key.toLowerCase();
      }
    });
    return genre;
  }
}

module.exports = genre;
