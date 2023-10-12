const express = require("express");
const knex = require("./conexao");

const rotas = require('./rotas');

const app = express();

app.use(express.json());
app.use(rotas);

app.get("/categoria", async (req, res) => {
  const categorias = await knex("categorias");
  return res.json(categorias);
});

app.listen(3000);
