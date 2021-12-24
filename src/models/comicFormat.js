const Sequelize = require('sequelize');

class comicFormat extends Sequelize.Model {
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
        formatId: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'format',
            key: 'id',
          },
        },
      },
      {
        sequelize,
        tableName: 'comic_format',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'comic_format_pkey',
            unique: true,
            fields: [{ name: 'comicId' }, { name: 'formatId' }],
          },
        ],
      }
    );
    return comicFormat;
  }
}

module.exports = comicFormat;
