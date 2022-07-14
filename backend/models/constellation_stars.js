import { Sequelize } from "sequelize";

const _constellation_stars = function (sequelize, DataTypes) {
  return sequelize.define(
    "constellation_stars",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      constellation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "constellations",
          key: "id",
        },
      },
      star_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "stars",
          key: "id",
        },
      },
      order_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "constellation_stars",
      timestamps: false,
      indexes: [
        {
          name: "sqlite_autoindex_constellation_stars_1",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};

export default _constellation_stars;
