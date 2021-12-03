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
        key: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'format',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'format_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            unique: true,
            fields: ['key'],
          },
        ],
      }
    );
    super.beforeSave((f) => {
      if (f.key) {
        // eslint-disable-next-line no-param-reassign
        f.key = f.key.toLowerCase();
      }
    });
    return format;
  }
}

module.exports = format;
