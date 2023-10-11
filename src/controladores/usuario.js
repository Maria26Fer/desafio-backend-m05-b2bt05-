const knex = require('../conexao');
const bcrypt = require('bcrypt');
const Joi = require('joi');

require('dotenv').config();

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    const camposObrigatorios = Joi.object().keys({
        nome: Joi.string().required().error(new Error('Informe o nome do usuário!')),
        email: Joi.string().required().error(new Error('Informe o e-mail do usuário!')),
        senha: Joi.string().required().error(new Error('Informe a senha do usuário!'))
    });
    try {
        await Joi.validate(req.body, camposObrigatorios, { abortEarly: false });
    } catch (error) {
        return res.status(400).json({ mensagem: 'Os campos nome, email e senha são obrigatórios!' });
    }

    try {
        const conferirEmail = await knex('usuario').where({ email });

        if (conferirEmail.length > 0) {
            return res.status(400).json({ mensagem: 'Esse e-mail já está cadastrado.' });
        }

        const criptografarSenha = await bcrypt.hash(senha, 10);

        const preencher = await knex('usuario').insert({ nome, email, senha: criptografarSenha });

        if (preencher.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Usuário não pôde ser cadastrado! Preencha todos os campos obrigatórios!!' });
        }

        const novoUsuario = await knex('usuario').where({ email }).first();

        const { senha: _, ...dadosObrigatorios } = novoUsuario;

        return res.status(201).json(dadosObrigatorios);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

module.exports = {
    cadastrarUsuario
}
