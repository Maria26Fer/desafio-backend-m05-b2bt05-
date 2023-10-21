const express = require("express");
const {
  cadastrarUsuario,
  login,
  detalharPerfil,
  editarUsuario,
} = require("./controladores/usuario");
const checaToken = require("./intermediarios/autenticacao");
const { listarCategorias } = require("./controladores/categorias");
const {
  cadastrarCliente,
  editarCliente,
  listarCliente,
  detalharCliente
} = require("./controladores/cliente");
const {
  cadastrarProduto,
  editarProduto,
  listarProduto,
  excluirProduto,
  detalharProduto
} = require("./controladores/produtos");

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
rotas.get("/cliente/:id", detalharCliente);


rotas.post("/produto", cadastrarProduto);
rotas.put("/produto/:id", editarProduto);
rotas.get("/produto", listarProduto);
rotas.get("/produto/:id", detalharProduto);
rotas.delete("/produto/:id", excluirProduto);

module.exports = rotas;
