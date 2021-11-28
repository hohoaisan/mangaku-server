const Sequelize = require('sequelize');

class comicGenre extends Sequelize.Model {
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
        genre: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'genre',
            key: 'id',
          },
        },
      },
      {
        sequelize,
        tableName: 'comic_genre',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'comic_genre_pkey',
            unique: true,
            fields: [{ name: 'comic' }, { name: 'genre' }],
          },
        ],
      }
    );
    return comicGenre;
  }
}

module.exports = comicGenre;
