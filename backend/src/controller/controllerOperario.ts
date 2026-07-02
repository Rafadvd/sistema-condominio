import type { Request, Response } from "express";
import pool from "../database/database.js"
import senhaHash from "../password/password.js";

export const Operario = {
    async create(req: Request<{},{}, { nome: string; cpf: string; email: string; senha: string, admin: boolean}>, res: Response) {

        console.log(req.body)

        const nome: string = req.body.nome;
        const cpf: string = req.body.cpf;
        const email: string = req.body.email;
        const senha: string = req.body.senha;
        const admin: boolean = req.body.admin;
        
        const senhaComHash = await senhaHash(senha)

        try {
            const queryTexto: string = `
            INSERT INTO operario (nome, cpf, email, senha_hash, admin_bool)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;
            
            const resultado = await pool.query(queryTexto, [nome, cpf, email, senhaComHash, admin]);
            const novoOperario = resultado.rows[0];

            return res.status(200).json(novoOperario);
        } catch (erro) {
            console.error(erro);

            return res.status(500).json({ mensage: "Erro interno ao criar operario" })
        }
    },

    async read(req: Request, res: Response) {
        try {
            const queryTexto: string = `
            SELECT * FROM operario`;

            const resultado = await pool.query(queryTexto);
            
            return res.status(200).json(resultado.rows);
        } catch (erro) {
            console.error(erro);

            return res.status(500).json({ mensage: "Erro interno ao mostrar tabelas" })
        }
    },

    async update(req: Request<{}, {}, {coluna: string; valor: string; cpf_operario: string}>, res: Response) {

        console.log(req.body)

        const coluna: string = req.body.coluna
        const valor: string = req.body.valor
        const cpf_operario: string = req.body.cpf_operario

        try {
            const queryTexto: string = `
            UPDATE operario
            SET ${coluna} = $1
            WHERE cpf = $2
            RETURNING *`;

            const resultado = await pool.query(queryTexto, [valor, cpf_operario]);
            
            return res.status(200).json(resultado.rows[0]);
        } catch (erro) {
            console.error(erro);

            return res.status(500).json({ mensage: "Erro interno ao modificar tabela"})
        }
    },

    async delete(req: Request<{},{}, {cpf_operario: string}>, res: Response) {

        console.log(req.body)
        
        const cpf_operario: string = req.body.cpf_operario
        try {
            const queryTexto: string = `
            DELETE FROM operario
            WHERE cpf = $1
            RETURNING *`;

            const resultado = await pool.query(queryTexto, [cpf_operario]);
            
            return res.status(200).json(resultado.rows[0]);
        } catch (erro) {
            console.error(erro);

            return res.status(500).json({ mensage: "Erro intero ao deletar coluna"})
        }
    }
};
