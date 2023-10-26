const knex = require("../conexao");
const joi = require("joi");

require("dotenv").config();

const cadastrarPedido = async (req, res) => {
    const { cliente_id, pedido_produtos, observacao } = req.body;

    const camposObrigatorios = joi.object({
        cliente_id: joi.number().required().messages({
            "any.required": "O campo de ID do cliente é obrigatório",
            "number.empty": "O campo de ID do cliente é obrigatório",
        }),
        pedido_produtos: joi.array().items(joi.object({
            produto_id: joi.number().required(),
            quantidade_produto: joi.number().required()
        })).required().messages({
            "any.required": "O campo de produtos pedidos é obrigatório.",
            "array.base": "O campo de produtos pedidos deve ser uma lista.",
        }),
        observacao: joi.string(),
    });

    try {
        await camposObrigatorios.validateAsync(req.body);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }

    try {
        const cliente = await knex('clientes').where({ id: cliente_id }).first();

        if (!cliente) {
            return res.status(400).json({ mensagem: "Cliente não encontrado." });
        }

        let valor_total = 0;

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

            valor_total += produto.valor;
        }

        const registrarTabelaPedidos = await knex('pedidos').insert({
            cliente_id,
            observacao,
            valor_total
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

const listarPedido = async (req, res) => {
    const clienteId = req.query.cliente_id;

    try {
      let query = knex('pedidos');
  
      if (clienteId) {
        query = query.where({ cliente_id: clienteId });
      }
  
      const pedidos = await query.select();
  
      if (pedidos.length === 0) {
        return res.status(404).json({ mensagem: 'Nenhum pedido encontrado.' });
      }
  
      for (const pedido of pedidos) {
        pedido.pedido_produtos = await knex('pedido_produtos')
          .where({ pedido_id: pedido.id })
          .select();
      }
  
      return res.status(200).json(pedidos);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao buscar pedidos.' });
    }
  };


module.exports = {
    cadastrarPedido,
    listarPedido
};
