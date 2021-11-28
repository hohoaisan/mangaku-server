const Sequelize = require('sequelize');
const { statuses } = require('../constraints/approvalStatus');

class author extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        user: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'user',
            key: 'id',
          },
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        approval_status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: statuses[0],
          validate: {
            isIn: statuses,
          },
        },
        restricted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: 'author',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'author_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
    return author;
  }
}
module.exports = author;
