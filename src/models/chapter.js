const Sequelize = require('sequelize');
const { statuses } = require('../constraints/approvalStatus');

class chapter extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        comic: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'comic',
            key: 'id',
          },
        },
        number: {
          type: DataTypes.DOUBLE,
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
        lastchap: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        numPages: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        volume: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        tableName: 'chapter',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'chapter_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
    return chapter;
  }
}

module.exports = chapter;
