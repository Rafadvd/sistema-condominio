import type { Request, Response } from "express";
import pool from "../database/database.js"
import senhaHash from "../password/password.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//login e devolver JWT

export const LoginCondomino = {
    async post(req:Request<{},{}, {cpf: string; senha: string}>, res:Response) {

        console.log(req.body);

        const cpf: string = req.body.cpf;
        const senha: string = req.body.senha;

        try {
            const queryTexto: string = "SELECT * FROM condomino WHERE cpf = $1";

            const resultado = await pool.query(queryTexto, [cpf]);
            const condomino = resultado.rows[0];

            if (!condomino) {
                return res.status(401).json({ error: "CPF ou senha incorretos "});
            }
            const senhaValida = await bcrypt.compare(senha, condomino.senha_hash);

            if (!senhaValida) {
                return res.status(401).json({ error: "CPF ou senha incorretos"});
            }

            const secret = process.env.JWT_SECRET;

            if (!secret) {
                throw new Error("JWT não está definido")
            }

            const token = jwt.sign({}, secret, {
                subject: String(condomino.id),
                expiresIn: "1d"
            })

            return res.json({ message: "Login realizado com sucesso" });
            } catch (erro) {
            console.error(erro);

            return res.status(500).json({ mensage: "Erro interno no login "})
        } 
     }
}
