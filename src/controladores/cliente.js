const knex = require("../conexao");
const joi = require("joi");

const cadastrarCliente = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body;

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
    cpf: joi.string().min(11).max(11).required().messages({
      "any.required": "O campo CPF é obrigatório",
      "string.empty": "O campo CPF é obrigatório",
      "string.min":
        "O campo CPF precisa conter, no mínimo, 11 caracteres, sem pontuação",
      "string.max":
        "O campo CPF precisa conter, no máximo, 11 caracteres, sem pontuação",
    }),
    cep: joi.string().min(8).max(8).default(null).messages({
      "string.min":
        "O campo CEP precisa conter, no mínimo, 8 caracteres, sem pontuação",
      "string.max":
        "O campo CPF precisa conter, no máximo, 8 caracteres, sem pontuação",
    }),
    rua: joi.string().default(null),
    numero: joi.string().default(null),
    bairro: joi.string().default(null),
    cidade: joi.string().default(null),
    estado: joi.string().default(null),
  });

  try {
    await camposObrigatorios.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }

  try {
    const emailExiste = await knex("clientes").where("email", email);

    const cpfExiste = await knex("clientes").where("cpf", cpf);

    if (emailExiste.length > 0) {
      return res.status(400).json({ mensagem: "E-mail já cadastrado" });
    }

    if (cpfExiste.length > 0) {
      return res.status(400).json({ mensagem: "CPF já cadastrado" });
    }

    const inserirCliente = await knex("clientes")
      .insert({
        nome,
        email,
        cpf,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
      })
      .returning("*");

    return res.status(201).json({ cliente: inserirCliente[0] });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const editarCliente = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body;
  const { id } = req.params;

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
    cpf: joi.string().min(11).max(11).required().messages({
      "any.required": "O campo CPF é obrigatório",
      "string.empty": "O campo CPF é obrigatório",
      "string.min":
        "O campo CPF precisa conter, no mínimo, 11 caracteres, sem pontuação",
      "string.max":
        "O campo CPF precisa conter, no máximo, 11 caracteres, sem pontuação",
    }),
    cep: joi.string().min(8).max(8).messages({
      "string.min":
        "O campo CEP precisa conter, no mínimo, 8 caracteres, sem pontuação",
      "string.max":
        "O campo CPF precisa conter, no máximo, 8 caracteres, sem pontuação",
    }),
    rua: joi.string(),
    numero: joi.string(),
    bairro: joi.string(),
    cidade: joi.string(),
    estado: joi.string(),
  });

  try {
    await camposObrigatorios.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }

  try {
    const idExiste = await knex("clientes").where({ id });

    if (idExiste.length === 0) {
      return res.status(400).json({ mensagem: "Cliente não encontrado" });
    }

    if (idExiste[0].email !== email) {
      const emailExiste = await knex("clientes").where("email", email);

      if (emailExiste.length > 0) {
        return res.status(400).json({ mensagem: "E-mail já cadastrado" });
      }
    }

    if (idExiste[0].cpf !== cpf) {
      const cpfExiste = await knex("clientes").where("cpf", cpf);

      if (cpfExiste.length > 0) {
        return res.status(400).json({ mensagem: "CPF já cadastrado" });
      }
    }

    const atualizarCliente = await knex("clientes")
      .where({ id })
      .update({
        nome,
        email,
        cpf,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
      })
      .returning("*");
    res.status(200).json({ cliente: atualizarCliente[0] });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const listarCliente = async (req, res) => {
 
    const clientes = await knex('clientes');
    return res.status(200).json({ clientes });
  };

  const detalharCliente = async (req, res) => {
    const { id } = req.params;

    const cliente = cliente.find(function (item){
        item.id === id;
    });

    if ( cliente ) {
      return res.status(200).json(cliente);

    } return res.status(404).json({message:'Não foi encontrado'});

  };






module.exports = {
  cadastrarCliente,
  editarCliente,
  listarCliente,
  detalharCliente
};
