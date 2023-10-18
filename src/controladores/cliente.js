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
    cpf: joi.string().min(11).required().messages({
      "any.required": "O campo CPF é obrigatório",
      "string.empty": "O campo CPF é obrigatório",
      "string.min": "O campo CPF precisa conter, no mínimo, 11 caracteres",
    }),
    cep: joi.string().min(8).default(null).messages({
      "string.min": "O campo CEP precisa conter, no mínimo, 8 caracteres",
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

    return res.json({ cliente: inserirCliente[0] });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
  cadastrarCliente,
};
