import type { Request, Response } from "express";
import pool from "../database/database.js"
import senhaHash from "../password/password.js";

export const Condomino = {
    async create(req:Request<{},{}, {lote: string; nome: string; cpf: string; numero: string; senha: string}>, res:Response) {
        
        console.log(req.body)
        
        const lote: string = req.body.lote
        const nome: string = req.body.nome
        const cpf: string = req.body.cpf
        const numero: string = req.body.numero
        const senha: string = req.body.senha

        const senhaComHash = await senhaHash(senha)

        try {
            const queryTexto = `
            INSERT INTO condomino (lote, nome, cpf, numero, senha_hash)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`
            
            const resultado = await pool.query(queryTexto, [lote, nome, cpf, numero, senhaComHash]);
            const novoOperario = resultado.rows[0];

            return res.status(200).json(novoOperario);
        } catch (erro) {
            console.error(erro);

            return res.status(500).json({ mensage: "Erro interno ao criar operario" })
        }
    },
    async read(req: Request, res: Response) {
        try {
            const queryTexto = `
            SELECT * FROM condomino`;

            const resultado = await pool.query(queryTexto);
            
            return res.status(200).json(resultado.rows);
        } catch (erro) {
            console.error(erro);

            return res.status(500).json({ mensage: "Erro interno ao mostrar tabelas" })
        }
    },
    async update(req: Request<{}, {}, {coluna: string; valor: string; cpf_condomino: string}>, res: Response) {

        console.log(req.body)

        const coluna: string = req.body.coluna
        const valor: string = req.body.valor
        const cpf_condomino: string = req.body.cpf_condomino

        try {
            const queryTexto = `
            UPDATE condomino
            SET ${coluna} = $1
            WHERE cpf = $2
            RETURNING *`;

            const resultado = await pool.query(queryTexto, [valor, cpf_condomino]);
            
            return res.status(200).json(resultado.rows[0]);
        } catch (erro) {
            console.error(erro);

            return res.status(500).json({ mensage: "Erro interno ao modificar tabela"})
        }
    },
    async delete(req: Request<{},{}, {cpf_condomino: string}>, res: Response) {

        console.log(req.body)
        
        const cpf_condomino: string = req.body.cpf_condomino
        try {
            const queryTexto = `
            DELETE FROM condomino
            WHERE cpf = $1
            RETURNING *`;

            const resultado = await pool.query(queryTexto, [cpf_condomino]);
            
            return res.status(200).json(resultado.rows[0]);
        } catch (erro) {
            console.error(erro);

            return res.status(500).json({ mensage: "Erro intero ao deletar coluna"})
        }
    }
};
