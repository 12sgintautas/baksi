import { Sequelize } from "sequelize";

const _constellations = function (sequelize, DataTypes) {
  return sequelize.define(
    "constellations",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      additional_info: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      start_time: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "constellations",
      timestamps: false,
      indexes: [
        {
          name: "sqlite_autoindex_constellations_1",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};

export default _constellations;
