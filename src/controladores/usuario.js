const knex = require('../conexao');
const bcrypt = require('bcrypt');
const yup = require('yup');

require('dotenv').config();

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    const camposObrigatorios = yup.object().shape({
        nome: yup.string().required({ mensagem: 'Informe o nome do usuário!' }),
        email: yup.string().required({ mensagem: 'Informe o e-mail do usuário!' }),
        senha: yup.string().required({ mensagem: 'Informe a senha do usuário!' })
    });

    try {
        await camposObrigatorios.validate(req.body);
    } catch (error) {
        return res.status(400).json({ mensagem: 'Os campos nome, email e senha são obrigatórios!' });
    }

    try {
        const conferirEmail = await knex('usuarios').where({ email });

        if (conferirEmail.length > 0) {
            return res.status(401).json({ mensagem: 'Esse e-mail já está cadastrado.' });
        }

        const criptografarSenha = await bcrypt.hash(senha, 10);

        const preencher = await knex('usuarios').insert({ nome, email, senha: criptografarSenha });

        if (preencher.rowCount === 0) {
            return res.status(500).json({ mensagem: 'Usuário não pôde ser cadastrado! Preencha todos os campos obrigatórios!!' });
        }

        const novoUsuario = await knex('usuarios').where({ email }).first();

        const { senha: _, ...dadosObrigatorios } = novoUsuario;

        return res.status(201).json(dadosObrigatorios);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Usuário não pôde ser cadastrado!' });
    }
}

module.exports = {
    cadastrarUsuario
}
