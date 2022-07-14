// sequelize-auto -h localhost -u dontcare -d db --dialect sqlite -c options.json npm install -g sequelize-cli

import { Sequelize } from "sequelize";
import initModels from "./models/init-models.js";

const db = new Sequelize({
  dialect: "sqlite",
  storage: "db.db",
});

const models = initModels(db);

export { models, db };
