import { DataTypes } from "sequelize";
import _constellation_stars from "./constellation_stars.js";
import _constellations from "./constellations.js";
import _stars from "./stars.js";

function initModels(sequelize) {
  var constellation_stars = _constellation_stars(sequelize, DataTypes);
  var constellations = _constellations(sequelize, DataTypes);
  var stars = _stars(sequelize, DataTypes);

  constellation_stars.belongsTo(constellations, {
    as: "constellation",
    foreignKey: "constellation_id",
  });
  constellations.hasMany(constellation_stars, {
    as: "constellation_stars",
    foreignKey: "constellation_id",
  });
  constellation_stars.belongsTo(stars, { as: "star", foreignKey: "star_id" });
  stars.hasMany(constellation_stars, {
    as: "constellation_stars",
    foreignKey: "star_id",
  });

  return {
    constellation_stars,
    constellations,
    stars,
  };
}

export default initModels;
