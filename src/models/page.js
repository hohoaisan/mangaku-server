const Sequelize = require('sequelize');

class page extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        chapterId: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'chapter',
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
        order: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'page',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'page_pkey',
            unique: true,
            fields: [{ name: 'chapterId' }, { name: 'imageId' }],
          },
        ],
      }
    );
    return page;
  }
}

module.exports = page;
