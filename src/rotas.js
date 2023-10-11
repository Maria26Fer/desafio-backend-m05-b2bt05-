const express = require('express');
const usuario = require('./controladores/usuario');

const rotas = express();

rotas.post('/usuario', usuario.cadastrarUsuario);

module.exports = rotas;
