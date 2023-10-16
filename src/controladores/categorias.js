const knex = require("../conexao");

const listarCategorias = async (req, res) => {
  const categorias = await knex("categorias");
  return res.json(categorias);
};

module.exports = {
  listarCategorias,
};
