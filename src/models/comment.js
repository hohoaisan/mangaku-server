const Sequelize = require('sequelize');

class comment extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: true,
          defaultValue: DataTypes.UUIDV4,
        },
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
        content: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'comment',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'comment_pkey',
            unique: true,
            fields: [{ name: 'comic' }, { name: 'user' }],
          },
        ],
      }
    );
    return comment;
  }
}

module.exports = comment;
