import { Sequelize } from "sequelize";

const _stars = function (sequelize, DataTypes) {
  return sequelize.define(
    "stars",
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
      right_ascension: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      declination: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      start_time: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "stars",
      timestamps: false,
      indexes: [
        {
          name: "sqlite_autoindex_stars_1",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};

export default _stars;
