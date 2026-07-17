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

    async update(req: Request<{}, {}, {coluna: string; valor: string; id: string}>, res: Response) {

        console.log(req.body)

        const coluna: string = req.body.coluna
        const valor: string = req.body.valor
        const id: string = req.body.id

        try {
            const queryTexto: string = `
            UPDATE operario
            SET ${coluna} = $1
            WHERE id = $2
            RETURNING *`;

            const resultado = await pool.query(queryTexto, [valor, id]);
            
            return res.status(200).json(resultado.rows[0]);
        } catch (erro) {
            console.error(erro);

            return res.status(500).json({ mensage: "Erro interno ao modificar tabela"})
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