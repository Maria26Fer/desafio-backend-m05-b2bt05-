const jwt = require("jsonwebtoken");
const knex = require("../conexao");
require("dotenv").config();

const checaToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ mensagem: "Não autorizado" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, process.env.JWT_PASS);

    const usuarioExiste = await knex("usuarios").where("id", id);

    if (usuarioExiste.length === 0) {
      return res.status(401).json({ mensagem: "Não autorizado" });
    }

    const { senha: _, ...usuario } = usuarioExiste[0];

    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(401).json({ mensagem: "Não autorizado" });
  }
};

module.exports = checaToken;
