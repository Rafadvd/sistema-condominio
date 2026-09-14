import type { Request, Response } from "express";
import pool from "../database/database.js"
import senhaHash from "../password/password.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//login e devolver JWT

export const LoginOperario = {
    async post(req:Request<{},{}, {cpf: string; senha: string}>, res:Response) {

        const cpf: string = req.body.cpf;
        const senha: string = req.body.senha;

        try {
            const queryTexto: string = "SELECT * FROM operario WHERE cpf = $1";

            const resultado = await pool.query(queryTexto, [cpf]);
            const operario = resultado.rows[0];
            if (!operario) {
                return res.status(401).json({ error: "CPF ou senha incorretos "});
            }

            const senhaValida = await bcrypt.compare(senha, operario.senha_hash);

            if (!senhaValida) {
                return res.status(401).json({ error: "CPF ou senha incorretos"});
            }

            const secret = process.env.JWT_SECRET;

            if (!secret) {
                throw new Error("JWT não está definido")
            }

            const token = jwt.sign({ perfil: "operario", admin: operario.admin_bool }, secret, {
                subject: String(operario.id),
                expiresIn: "1d"
            })
            
            return res.json({ 
                message: "Login realizado com sucesso",
                token: token 
            });
            
            } catch (erro) {
            console.error(erro);

            return res.status(500).json({ mensage: "Erro interno no login "})
        } 
     },
    async alterarSenha(req: Request<{}, {}, { senhaAtual: string; novaSenha: string }>, res: Response) {
        const { senhaAtual, novaSenha } = req.body;
        const idOperario = req.userID;

        if (!senhaAtual || !novaSenha) {
            return res.status(400).json({ error: "Informe a senha atual e a nova senha." });
        }
        if (novaSenha.length < 6) {
            return res.status(400).json({ error: "A nova senha deve ter pelo menos 6 caracteres." });
        }

        try {
            const resultado = await pool.query("SELECT senha_hash FROM operario WHERE id = $1", [idOperario]);
            const operario = resultado.rows[0];

            if (!operario) {
                return res.status(404).json({ error: "Conta de operário não encontrada." });
            }
            if (!(await bcrypt.compare(senhaAtual, operario.senha_hash))) {
                return res.status(401).json({ error: "A senha atual está incorreta." });
            }

            const novaSenhaHash = await senhaHash(novaSenha);
            await pool.query("UPDATE operario SET senha_hash = $1 WHERE id = $2", [novaSenhaHash, idOperario]);
            return res.status(200).json({ message: "Senha alterada com sucesso." });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ error: "Não foi possível alterar a senha." });
        }
    }
}
