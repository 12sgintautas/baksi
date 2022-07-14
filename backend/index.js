import express from "express";
import { models, db } from "./db.js";

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

app.use(express.json());

app.get("/", async (rec, res) => {
  // try {
  //     await db.authenticate();
  //     console.log('Connection has been established successfully.');
  // } catch (error) {
  //     console.error('Unable to connect to the database:', error);
  // }
  res.status(200).send({
    message: "This JSON object contains documentation of API",
    items: [{ method: "GET", path: "/", description: "Documentation" }, {}],
  });
});

app.get("/stars", async (req, res) => {
  try {
    const stars = await models.stars.findAll();
    res.status(200).send(stars);
  } catch (error) {
    res.status(400).send(error);
  }
});
app.get("/star/:id", async (req, res) => {
  try {
    const star = await models.stars.findByPk(req.params.id);
    res.status(200).send(star);
  } catch (error) {
    res.status(400).send(error);
  }
});
app.delete("/star/:id", async (req, res) => {
  try {
    const db_res = await models.stars.destroy({ where: { id: req.params.id } });
    console.log(db_res);
    res.status(204).send();
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      const constalation_stars = (
        await models.constellation_stars.findAll({
          attributes: ["constellation_id"],
          where: { star_id: req.params.id },
          raw: true,
        })
      ).map((x) => x.constellation_id);
      const constalations = await models.constellations.findAll({
        where: { id: constalation_stars },
        raw: true,
      });
      res.status(200).send(constalations);
    } else {
      res.status(400).send(error);
    }
  }
});
app.post("/star", async (req, res) => {
  const star = req.body;
  try {
    const new_star = await models.stars.create({
      name: star.name,
      additional_info: star.additional_info,
      right_ascension: star.right_ascension,
      declination: star.declination,
      start_time: star.start_time,
    });
    res.status(201).send({ id: new_star.dataValues.id });
  } catch (error) {
    res.status(400).send(error);
  }
});
app.put("/star/:id", async (req, res) => {
  const new_star = req.body;
  try {
    const star = await models.stars.findByPk(req.params.id);
    if (new_star.name) star.name = new_star.name;
    if (new_star.additional_info)
      star.additional_info = new_star.additional_info;
    if (new_star.right_ascension)
      star.right_ascension = new_star.right_ascension;
    if (new_star.declination) star.declination = new_star.declination;
    if (new_star.start_time) star.start_time = new_star.start_time;
    star.save();
    res.status(200).send(star);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/constellations", async (req, res) => {
  try {
    const constellations = await models.constellations.findAll({
      raw: true,
    });
    const ress = await Promise.all(
      constellations.map(async (x) => {
        const stars = await db.query(
          "SELECT star_id FROM constellation_stars AS cs WHERE cs.constellation_id = " +
            x.id +
            " ORDER BY order_number"
        );

        return { ...x, stars: stars[0].map((y) => y.star_id) };
      })
    );
    res.status(200).send(ress);
  } catch (error) {
    res.status(400).send(error);
  }
});
app.get("/constellation/:id", async (req, res) => {
  try {
    const constellation = await db.query(
      "SELECT * FROM constellations AS c LEFT JOIN constellation_stars AS cs ON c.id == cs.constellation_id LEFT JOIN stars AS s ON s.id == cs.star_id WHERE c.id == " +
        req.params.id
    );
    res.status(200).send(constellation);
  } catch (error) {
    res.status(400).send(error);
  }
});
app.delete("/constellation/soft/:id", async (req, res) => {
  try {
    await db.transaction(async (t) => {
      const db_res_b = await models.constellation_stars.destroy(
        { where: { constellation_id: req.params.id } },
        { transaction: t }
      );
      const db_res_a = await models.constellations.destroy(
        { where: { id: req.params.id } },
        { transaction: t }
      );
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).send(error);
  }
});
app.post("/constellation", async (req, res) => {
  const constellation = req.body;
  try {
    const new_constellation = await db.transaction(async (t) => {
      const new_constellation = await models.constellations.create(
        {
          name: constellation.name,
          additional_info: constellation.additional_info,
          start_time: constellation.start_time,
        },
        { transaction: t }
      );
      const constellation_id = new_constellation.dataValues.id;
      const stars_ids = constellation.stars;
      const cs = stars_ids.map((id, index) => {
        return {
          constellation_id: constellation_id,
          star_id: id,
          order_number: index,
        };
      });
      const res = await models.constellation_stars.bulkCreate(cs, {
        transaction: t,
      });
      return new_constellation;
    });
    res.status(201).send({ id: new_constellation.dataValues.id });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.put("/constellation/:id", async (req, res) => {
  const new_constellation = req.body;
  const id = req.params.id;
  try {
    const constalation = await models.constellations.findByPk(id);
    if (new_constellation.name) constalation.name = new_constellation.name;
    if (new_constellation.additional_info)
      constalation.additional_info = new_constellation.additional_info;
    if (new_constellation.start_time)
      constalation.start_time = new_constellation.start_time;
    constalation.save();
    if (new_constellation.stars) {
      await models.constellation_stars.destroy({
        where: { constellation_id: id },
      });
      const cs = new_constellation.stars.map((star_id, index) => {
        return {
          constellation_id: id,
          star_id: star_id,
          order_number: index,
        };
      });
      await models.constellation_stars.bulkCreate(cs);
    }
    res.status(200).send(constalation);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(process.env.PORT || 5001, () => {
  console.log("Server started");
});
