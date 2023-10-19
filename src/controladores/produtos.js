const knex = require("../conexao");
const joi = require("joi");

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

  const camposObrigatorios = joi.object({
    descricao: joi.string().required().messages({
      "any.required": "O campo descrição deve ser informado.",
    }),
    quantidade_estoque: joi.number().required().messages({
      "number.base": "O campo quantidade_estoque dever ser um número.",
      "any.required": "O campo quantidade_estoque deve ser informado.",
    }),
    valor: joi.number().required().messages({
      "number.base": "O campo valor dever ser um número.",
      "any.required": "O campo valor deve ser informado.",
    }),
    categoria_id: joi.number().required().messages({
      "number.base": "O campo id da categoria dever ser um número.",
      "any.required": "O campo id da categoria deve ser informado.",
    }),
    descricao: joi.string().default(null),
    quantidade_estoquet: joi.number().default(null),
    valor: joi.number().default(null),
    categoria_id: joi.number().default(null),
  });

  try {
    await camposObrigatorios.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }

  try {
    const categoriaId = await knex("produtos").where(
      "categoria_id",
      categoria_id
    );

    if (categoriaId === 0) {
      return res
        .status(400)
        .json({ mensagem: "O id da categoria não foi encontrado" });
    }

    const inserirProduto = await knex("produtos")
      .insert({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
      })
      .returning("*");

    return res.status(201).json({ produto: inserirProduto[0] });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
  cadastrarProduto,
};
