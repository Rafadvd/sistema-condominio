import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(req: Request,res: Response,next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Formato do token inválido' });
  }

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT não está definido")
    }
    
    const decoded = jwt.verify(token, secret) as IPayload;

    req.userID = decoded.sub;

    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};