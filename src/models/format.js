const Sequelize = require('sequelize');

class format extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'format',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'format_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
    return format;
  }
}

module.exports = format;
