const knex = require("../conexao");
const joi = require("joi");

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

  const camposObrigatorios = joi.object({
    descricao: joi.string().required().messages({
      "any.required": "O campo descrição deve ser informado.",
    }),
    quantidade_estoque: joi.number().required().messages({
      "number.base": "O campo quantidade de estoque dever ser um número.",
      "any.required": "O campo quantidade de estoque deve ser informado.",
    }),
    valor: joi.number().required().messages({
      "number.base": "O campo valor dever ser um número.",
      "any.required": "O campo valor deve ser informado.",
    }),
    categoria_id: joi.number().required().messages({
      "number.base": "O campo id da categoria dever ser um número.",
      "any.required": "O campo id da categoria deve ser informado.",
    }),
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

const editarProduto = async (req, res) => {
  const { id } = req.params;
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

  const camposObrigatorios = joi.object({
    descricao: joi.string().required().messages({
      "any.required": "O campo descrição deve ser informado.",
    }),
    quantidade_estoque: joi.number().required().messages({
      "number.base": "O campo quantidade de estoque dever ser um número.",
      "any.required": "O campo quantidade de estoque deve ser informado.",
    }),
    valor: joi.number().required().messages({
      "number.base": "O campo valor dever ser um número.",
      "any.required": "O campo valor deve ser informado.",
    }),
    categoria_id: joi.number().required().messages({
      "number.base": "O campo id da categoria dever ser um número.",
      "any.required": "O campo id da categoria deve ser informado.",
    }),
  });

  try {
    await camposObrigatorios.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }

  try {
    const categoriaId = await knex("produtos").where("categoria_id", categoria_id);

    if (categoriaId.length === 0) {
      return res.status(400).json({ mensagem: "O id da categoria não foi encontrado" });
    }

    const produtoId = await knex("produtos").where("id", id);

    if (produtoId.length === 0) {
      return res.status(400).json({ mensagem: "O id do produto não foi encontrado" });
    }

    const produtoCadastrado = await knex('produtos')
      .update({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
      })
      .where('id', id)
      .returning('*');

    return res.json(produtoCadastrado);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
};


const listarProduto = async (req, res) => {
  const { categoria_id } = req.query;

  try {



  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
};


module.exports = {
  cadastrarProduto,
  editarProduto,
  listarProduto
};