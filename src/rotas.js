const express = require("express");
const {
  cadastrarUsuario,
  login,
  detalharPerfil,
  editarUsuario,
} = require("./controladores/usuario");
const checaToken = require("./intermediarios/autenticacao");
const { listarCategorias } = require("./controladores/categorias");
const { cadastrarCliente } = require("./controladores/cliente");

const rotas = express();

rotas.get("/categoria", listarCategorias);

rotas.post("/usuario", cadastrarUsuario);

rotas.post("/login", login);

rotas.use(checaToken);

rotas.get("/usuario", detalharPerfil);
rotas.put("/usuario", editarUsuario);

rotas.post("/cliente", cadastrarCliente);

module.exports = rotas;
