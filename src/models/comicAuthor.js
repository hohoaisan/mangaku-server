const Sequelize = require('sequelize');

class comicAuthor extends Sequelize.Model {
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
        author: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'author',
            key: 'id',
          },
        },
      },
      {
        sequelize,
        tableName: 'comic_author',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'comic_author_pkey',
            unique: true,
            fields: [{ name: 'comic' }, { name: 'author' }],
          },
        ],
      }
    );
    return comicAuthor;
  }
}

module.exports = comicAuthor;
