import type { Request, Response } from "express";
import pool from "../database/database.js"
import senhaHash from "../password/password.js";

//CRUD dos operarios

export const Operario = {
    async create(req: Request<{}, {}, { nome?: unknown; cpf?: unknown; email?: unknown; senha?: unknown; admin?: unknown }>, res: Response) {
        const nome = typeof req.body.nome === "string" ? req.body.nome.trim() : "";
        const cpf = typeof req.body.cpf === "string" ? req.body.cpf.trim() : "";
        const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
        const senha = typeof req.body.senha === "string" ? req.body.senha : "";
        const admin = req.body.admin === true;

        if (!nome || !cpf || !email || !senha) {
            return res.status(400).json({ error: "Preencha nome, CPF, e-mail e senha." });
        }
        if (nome.length > 100 || !/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(cpf)) {
            return res.status(400).json({ error: "Informe um nome e CPF válidos." });
        }
        if (email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: "Informe um e-mail válido." });
        }
        if (senha.length < 6) {
            return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres." });
        }

        try {
            const senhaComHash = await senhaHash(senha);
            const queryTexto: string = `
            INSERT INTO operario (nome, cpf, email, senha_hash, admin_bool)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, nome, cpf, email, admin_bool`;
            
            const resultado = await pool.query(queryTexto, [nome, cpf, email, senhaComHash, admin]);
            const novoOperario = resultado.rows[0];

            return res.status(201).json(novoOperario);
        } catch (erro) {
            console.error(erro);

            if ((erro as { code?: string }).code === "23505") {
                return res.status(409).json({ error: "Já existe um operário com este CPF ou e-mail." });
            }

            return res.status(500).json({ error: "Erro interno ao criar operário." })
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
