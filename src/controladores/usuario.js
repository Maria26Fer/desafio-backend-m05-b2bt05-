const knex = require("../conexao");
const bcrypt = require("bcrypt");
const joi = require("joi");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  const camposObrigatorios = joi.object({
    nome: joi.string().required().messages({
      "any.required": "O campo nome é obrigatório",
      "string.empty": "O campo nome é obrigatório",
    }),
    email: joi.string().email().required().messages({
      "any.required": "O campo email é obrigatório",
      "string.email": "Digite um email válido",
      "string.empty": "O campo email é obrigatório",
    }),
    senha: joi.string().min(5).required().messages({
      "any.required": "O campo senha é obrigatório",
      "string.empty": "O campo senha é obrigatório",
    }),
  });

  try {
    await camposObrigatorios.validateAsync(req.body);
  } catch (error) {
    return res
      .status(400)
      .json({ mensagem: error.message });
  }

  try {
    const conferirEmail = await knex("usuarios").where({ email });

    if (conferirEmail.length > 0) {
      return res
        .status(400)
        .json({ mensagem: "Esse e-mail já está cadastrado." });
    }

    const criptografarSenha = await bcrypt.hash(senha, 10);

    const preencher = await knex("usuarios").insert({
      nome,
      email,
      senha: criptografarSenha,
    });

    if (preencher.rowCount === 0) {
      return res.status(400).json({
        mensagem:
          "Usuário não pôde ser cadastrado! Preencha todos os campos obrigatórios!!",
      });
    }

    const novoUsuario = await knex("usuarios").where({ email }).first();

    const { senha: _, ...dadosObrigatorios } = novoUsuario;

    return res.status(201).json(dadosObrigatorios);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  const camposObrigatorios = joi.object({
    email: joi.string().email().required().messages({
      "any.required": "O campo email é obrigatório",
      "string.email": "Digite um email válido",
      "string.empty": "O campo email é obrigatório",
    }),
    senha: joi.string().required().messages({
      "any.required": "O campo senha é obrigatório",
      "string.empty": "O campo senha é obrigatório",
    }),
  });

  try {
    await camposObrigatorios.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }

  try {
    const usuarioExiste = await knex("usuarios").where("email", email);

    if (usuarioExiste.length === 0) {
      return res.status(400).json({ mensagem: "Email e/ou senha inválidos" });
    }

    const senhaValida = await bcrypt.compare(senha, usuarioExiste[0].senha);

    if (!senhaValida) {
      return res.status(400).json({ mensagem: "Email e/ou senha inválidos" });
    }

    const token = jwt.sign({ id: usuarioExiste[0].id }, process.env.JWT_PASS, {
      expiresIn: "8h",
    });

    const { senha: _, ...usuarioLogado } = usuarioExiste[0];

    return res.json({ usuario: usuarioLogado, token });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const detalharPerfil = async (req, res) => {
  const id = req.usuario.id;
  try {
    const usuario = await knex("usuarios").where("id", id).first();

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuario não encontrado." });
    }
    return res.status(200).json({ mensagem: usuario });
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const editarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  const { id } = req.usuario;

  const camposObrigatorios = joi.object({
    nome: joi.string().required().messages({
      "any.required": "O campo nome é obrigatório",
      "string.empty": "O campo nome é obrigatório",
    }),
    email: joi.string().email().required().messages({
      "any.required": "O campo email é obrigatório",
      "string.email": "Digite um email válido",
      "string.empty": "O campo email é obrigatório",
    }),
    senha: joi.string().required().messages({
      "any.required": "O campo senha é obrigatório",
      "string.empty": "O campo senha é obrigatório",
    }),
  });

  try {
    await camposObrigatorios.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }

  try {
    const conferirEmail = await knex("usuarios")
      .where({ email })
      .whereNot({ id });

    if (conferirEmail.length > 0) {
      return res
        .status(400)
        .json({ mensagem: "Esse e-mail já está cadastrado." });
    }

    const criptografarSenha = await bcrypt.hash(senha, 10);

    const resultado = await knex("usuarios").where({ id }).update({
      nome,
      email,
      senha: criptografarSenha,
    });

    if (resultado === 0) {
      return res.status(400).json({
        mensagem:
          "Perfil do usuário não pôde ser atualizado! Verifique os campos obrigatórios!",
      });
    }

    const novoUsuario = await knex("usuarios").where({ id }).first();

    const { senha: _, ...dadosObrigatorios } = novoUsuario;

    return res.status(200).json(dadosObrigatorios);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
  cadastrarUsuario,
  login,
  detalharPerfil,
  editarUsuario,
};
