import type { Request, Response } from "express";
import pool from "../database/database.js"
import senhaHash from "../password/password.js";
import { Query } from "pg";

//CRUD das requisições de liberação

export const Liberacao = {
    async create(req: Request<{},{}, { 
        id_condomino: number; tipo_visitante: string; 
        nome_visitante: string; cpf_visitante: string;
        rg_visitante: string; placa_visitante: string;
        data_hora_expiracao: string}>, res: Response) {

        console.log(req.body)
        const id_condomino: number = req.body.id_condomino;
        const tipo_visitante: string = req.body.tipo_visitante;
        const nome_visitante: string = req.body.nome_visitante;
        const cpf_visitante: string = req.body.cpf_visitante;
        const rg_visitante: string = req.body.rg_visitante;
        const placa_visitante: string = req.body.placa_visitante;
        const data_hora_expiracao: string = req.body.data_hora_expiracao;
        
        try {
            const queryTexto: string = `
            INSERT INTO liberacao (
            id_condomino, tipo_visitante, 
            nome_visitante, cpf_visitante, 
            rg_visitante, placa_visitante,
            data_hora_expiracao)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`;

            const resultado = await pool.query(queryTexto, [id_condomino, tipo_visitante, nome_visitante, cpf_visitante, rg_visitante, placa_visitante, data_hora_expiracao]);
            const novaLiberacao = resultado.rows[0];

            return res.status(201).json(novaLiberacao);
        } catch (erro) {
            console.error(erro);

            return res.status(500).json({ mensage: "Erro interno ao criar liberação" })
        }
    },

    async read(req: Request, res: Response) {
        try {
            const queryTexto: string = `
            SELECT * FROM liberacao`

            const resultado = await pool.query(queryTexto);
            
            return res.status(200).json(resultado.rows);
        } catch (erro) {
            console.error(erro);

            return res.status(200).json({ mensage: "Erro interno ao ler liberações" })
        }
    },

    async update(req: Request<{}, {}, { id: number; acao: string }>, res: Response) {
        const id: number = req.body.id;
        const acao: string = req.body.acao;
        const idOperario = req.userID;

        const acoes: Record<string, { status: string; sql: string }> = {
            entrada: {
                status: "EM_VISITA",
                sql: `
                    UPDATE liberacao
                    SET status_entrada = 'EM_VISITA',
                        data_hora_entrada = CURRENT_TIMESTAMP,
                        id_operario_entrada = $1
                    WHERE id = $2 AND status_entrada = 'PENDENTE'
                    RETURNING *`,
            },
            cancelar: {
                status: "CANCELADA",
                sql: `
                    UPDATE liberacao
                    SET status_entrada = 'CANCELADA'
                    WHERE id = $1 AND status_entrada = 'PENDENTE'
                    RETURNING *`,
            },
            saida: {
                status: "CONCLUIDA",
                sql: `
                    UPDATE liberacao
                    SET status_entrada = 'CONCLUIDA',
                        data_hora_saida = CURRENT_TIMESTAMP,
                        id_operario_saida = $1
                    WHERE id = $2 AND status_entrada = 'EM_VISITA'
                    RETURNING *`,
            },
        };

        const config = acoes[acao];

        if (!config) {
            return res.status(400).json({ mensage: "Ação inválida" });
        }

        try {
            const params =
                acao === "cancelar"
                    ? [id]
                    : [idOperario, id];

            const resultado = await pool.query(config.sql, params);

            if (resultado.rows.length === 0) {
                return res.status(400).json({
                    mensage: "Não foi possível atualizar esta liberação no status atual",
                });
            }

            return res.status(200).json(resultado.rows[0]);
        } catch (erro) {
            console.error(erro);

            return res.status(500).json({ mensage: "Erro interno ao modificar liberação" });
        }
    },

    async delete(req: Request<{},{}, {id: number}>, res: Response) {

        console.log(req.body)
        
        const id: number = req.body.id
        try {
            const queryTexto: string = `
            DELETE FROM liberacao
            WHERE id = $1
            RETURNING *`;

            const resultado = await pool.query(queryTexto, [id]);
            
            return res.status(200).json(resultado.rows[0]);
        } catch (erro) {
            console.error(erro);

            return res.status(500).json({ mensage: "Erro intero ao deletar coluna"})
        }
    }
};