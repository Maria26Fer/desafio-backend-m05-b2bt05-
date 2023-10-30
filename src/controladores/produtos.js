const knex = require("../conexao");
const joi = require("joi");
const { uploadImagem } = require("../servicos/uploads");

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { originalname, buffer } = req.file;

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

    const upload = await uploadImagem(originalname, buffer);

    const inserirProduto = await knex("produtos")
      .insert({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
        produto_imagem: upload.url,
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
    const categoriaId = await knex("produtos").where(
      "categoria_id",
      categoria_id
    );

    if (categoriaId.length === 0) {
      return res
        .status(400)
        .json({ mensagem: "O id da categoria não foi encontrado" });
    }

    const produtoId = await knex("produtos").where("id", id);

    if (produtoId.length === 0) {
      return res
        .status(400)
        .json({ mensagem: "O id do produto não foi encontrado" });
    }

    const produtoCadastrado = await knex("produtos")
      .update({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
      })
      .where("id", id)
      .returning("*");

    return res.json(produtoCadastrado);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
};

const listarProduto = async (req, res) => {
  const { categoria_id } = req.query;

  try {
    if (categoria_id) {
      const categoriaExiste = await knex("produtos").where(
        "categoria_id",
        categoria_id
      );
      if (categoriaExiste.length > 0) {
        return res.status(200).json({ produtos: categoriaExiste });
      }
    }
    const produtos = await knex("produtos").select("*");

    return res.status(200).json({ produtos });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
};

const detalharProduto = async (req, res) => {
  const { id } = req.params;

  try {
    const produto = await knex("produtos").where("id", id).first();

    if (!produto) {
      return res.status(404).json({ mensagem: "Produto não encontrado." });
    }

    return res.status(200).json(produto);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno no servidor." });
  }
};

const excluirProduto = async (req, res) => {
  const { id } = req.params;
  try {
    const produtoExiste = await knex("produtos").where({ id });

    if (produtoExiste.length === 0) {
      return res.status(400).json({ mensagem: "Produto não encontrado" });
    }

    const produtoExcluido = await knex("produtos")
      .where({ id })
      .del()
      .returning("*");

    return res.status(200).json({ produtoExcluido });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
};

module.exports = {
  cadastrarProduto,
  editarProduto,
  listarProduto,
  detalharProduto,
  excluirProduto,
};
