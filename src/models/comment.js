const Sequelize = require('sequelize');
const plugins = require('./plugins');

class comment extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        comicId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'comic',
            key: 'id',
          },
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id',
          },
        },
        content: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'comment',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'comment_indexes',
            fields: [{ name: 'id' }, { name: 'comicId' }, { name: 'userId' }],
          },
          {
            name: 'comment_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
    return comment;
  }
}

plugins.paginate(comment);

module.exports = comment;
