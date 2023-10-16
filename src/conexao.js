require("dotenv").config();

const knex = require("knex")({
  client: "pg",
  connection: process.env.DB_URL,
});

module.exports = knex;
