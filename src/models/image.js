const Sequelize = require('sequelize');

class image extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        url: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        uploader: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'user',
            key: 'id',
          },
        },
      },
      {
        sequelize,
        tableName: 'image',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'image_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
    return image;
  }
}

module.exports = image;
