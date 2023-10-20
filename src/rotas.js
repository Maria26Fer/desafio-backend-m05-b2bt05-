const express = require("express");
const {
  cadastrarUsuario,
  login,
  detalharPerfil,
  editarUsuario,
} = require("./controladores/usuario");
const checaToken = require("./intermediarios/autenticacao");
const { listarCategorias } = require("./controladores/categorias");
const { cadastrarCliente, editarCliente, listarCliente } = require("./controladores/cliente");
const { cadastrarProduto } = require("./controladores/produtos");

const rotas = express();

rotas.get("/categoria", listarCategorias);

rotas.post("/usuario", cadastrarUsuario);

rotas.post("/login", login);

rotas.use(checaToken);

rotas.get("/usuario", detalharPerfil);
rotas.put("/usuario", editarUsuario);

rotas.post("/cliente", cadastrarCliente);
rotas.put("/cliente/:id", editarCliente);
rotas.get("/cliente", listarCliente);

rotas.post("/produto", cadastrarProduto);

module.exports = rotas;
