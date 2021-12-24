const Sequelize = require('sequelize');

class comicCover extends Sequelize.Model {
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
        imageId: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'image',
            key: 'id',
          },
        },
        default: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: 'comic_cover',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'comic_cover_pkey',
            unique: true,
            fields: [{ name: 'comicId' }, { name: 'imageId' }],
          },
        ],
      }
    );
    return comicCover;
  }
}

module.exports = comicCover;
