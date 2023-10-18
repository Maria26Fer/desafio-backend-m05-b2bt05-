const express = require("express");
const {
  cadastrarUsuario,
  login,
  detalharPerfil,
  editarUsuario,
} = require("./controladores/usuario");
const checaToken = require("./intermediarios/autenticacao");
const knex = require("./conexao");
const { listarCategorias } = require("./controladores/categorias");

const rotas = express();

rotas.get("/categoria", listarCategorias);

rotas.post("/usuario", cadastrarUsuario);

rotas.post("/login", login);

//rotas.use(checaToken);

rotas.get("/usuario", detalharPerfil);

rotas.put("/usuario", editarUsuario);

module.exports = rotas;
