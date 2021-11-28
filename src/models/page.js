const Sequelize = require('sequelize');

class page extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        chapter: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'chapter',
            key: 'id',
          },
        },
        image: {
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
        timestamps: true,
        indexes: [
          {
            name: 'page_pkey',
            unique: true,
            fields: [{ name: 'chapter' }, { name: 'image' }],
          },
        ],
      }
    );
    return page;
  }
}

module.exports = page;
