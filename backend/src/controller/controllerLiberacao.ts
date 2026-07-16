import type { Request, Response } from "express";
import pool from "../database/database.js"
import senhaHash from "../password/password.js";

export const liberacao = {
    async create(req: Request, res: Response) {
        try {
            const queryTexto: string = `
            INSERT INTO liberacao (
            id_condomino, tipo_visitante, tipo_customizado, 
            nome_visitante, cpf_visitante, placa_visitante,)
            `
        }
    },
};