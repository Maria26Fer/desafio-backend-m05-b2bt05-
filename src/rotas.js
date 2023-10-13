const express = require("express");
const {
  cadastrarUsuario,
  login,
  detalharPerfil,
} = require("./controladores/usuario");
const checaToken = require("./intermediarios/autenticacao");
const knex = require("./conexao");

const rotas = express();

rotas.get("/categoria", async (req, res) => {
  const categorias = await knex("categorias");
  return res.json(categorias);
});

rotas.post("/usuario", cadastrarUsuario);

rotas.post("/login", login);

rotas.use(checaToken);

rotas.get("/usuario", detalharPerfil);

module.exports = rotas;
