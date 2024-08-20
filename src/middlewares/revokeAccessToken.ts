import { Request, Response, NextFunction } from "express";
import { Redis } from "../database/config/redisConnection";
import jwt, { JwtPayload } from "jsonwebtoken";



export async function revokeAccessToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const rawToken = (req.headers["authorization"]);
        const token = rawToken?.split(" ");
        if (!token) {
            next();
        } else {
            const tokenPayload: any = jwt.decode(token[1]);
            await Redis.writeInvalidToken(token[1], tokenPayload.invalidTokenId);
            next();
        }
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }
}
