const knex = require("../conexao");
const joi = require("joi");

require("dotenv").config();

const cadastrarPedido = async (req, res) => {
    const { cliente_id, pedido_produtos, observacao } = req.body;

    const camposObrigatorios = joi.object({
        cliente_id: joi.number().required().messages({
            "any.required": "O campo cliente_id é obrigatório",
            "number.empty": "O campo cliente_id é obrigatório",
        }),
        pedido_produtos: joi.array().items(joi.object({
            produto_id: joi.number().required(),
            quantidade_produto: joi.number().required()
        })).required().messages({
            "any.required": "O campo pedido_produtos é obrigatório",
            "array.base": "O campo pedido_produtos deve ser um array",
        }),
        observacao: joi.string(),
    });

    try {
        await camposObrigatorios.validateAsync(req.body);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }

    try {
        const cliente = await knex('cliente').where({ id: cliente_id }).first();

        if (!cliente) {
            return res.status(400).json({ mensagem: "Cliente não encontrado." });
        }

        let valorTotal = 0;

        for (const item of pedido_produtos) {
            const produto = await knex('produtos').where({ id: item.produto_id }).first();

            if (!produto) {
                return res.status(400).json({ mensagem: `Não existe produto com o id ${item.produto_id}.` });
            }

            if (produto.quantidade_estoque < item.quantidade_produto) {
                return res.status(400).json({ mensagem: `Não há estoque suficiente - produto com quantidade inferior a ${item.quantidade_produto} unidades.` });
            }

            const subtracao = produto.quantidade_estoque - item.quantidade_produto;

            const atualizarEstoque = await knex('produtos')
                .where({ id: item.produto_id })
                .update({ quantidade_estoque: subtracao });

            if (!atualizarEstoque) {
                return res.status(500).json({ mensagem: "Não foi possível atualizar o estoque." });
            }

            valorTotal += produto.valor;
        }

        const registrarTabelaPedidos = await knex('pedidos').insert({
            cliente_id,
            observacao,
            valorTotal
        });

        if (!registrarTabelaPedidos) {
            return res.status(500).json({ mensagem: "Não foi possível atualizar os pedidos." });
        }

        const pedidoPorID = await knex('pedidos').where({ cliente_id });

        for (const item of pedido_produtos) {
            const produto = await knex('produtos').where({ id: item.produto_id }).first();
            let pedido_id = pedidoPorID[pedidoPorID.length - 1].id;

            const novoPedido = await knex('pedido_produtos').insert({
                pedido_id,
                produto_id: item.produto_id,
                quantidade_produto: item.quantidade_produto,
                valor_produto: produto.valor
            });

            if (!novoPedido) {
                return res.status(500).json({ mensagem: "Não foi possível atualizar os produtos dos pedidos" });
            }
        }
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }

    return res.status(201).json({ mensagem: "Pedido cadastrado com sucesso!" });
}

module.exports = {
    cadastrarPedido,
};
