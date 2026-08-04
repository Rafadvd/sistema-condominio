import type { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';


interface IPayload {
    sub: string;
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    console.log(authHeader);

    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    const [, token] = authHeader.split (' ');

    try{
        const secret = process.env.JWT_SECRET || 'sua_chave_secreta_padrao';
        const decoded = verify(token, secret) as IPayload;

        req.userID = decoded.sub;

        return next()
    } catch {
        return res.status(401).json({ error: "Token inválido ou expirado"})
    }

}