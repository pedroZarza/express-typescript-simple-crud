import { Request, Response } from "express";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { readUserByEmail } from "../services/userService";
import { Redis } from "../database/config/redisConnection";
require('dotenv').config();

export async function refreshToken(req: Request, res: Response): Promise<Response | undefined> {
    try {
        const refreshToken: string = req.cookies["refreshToken"];
        if (!refreshToken) {
            return res.status(401).json({
                status: "error",
                message: "No refresh token provided"
            })
        }
        const secretKey = String(process.env.SECRETKEY_JWT);
        jwt.verify(refreshToken, secretKey, async function (err, decoded: any){
            if(err){
                return res.status(401).json({
                    status: "error",
                    message: "Invalid refresh token"
                })
            }
            const existInBlacklist = await Redis.checkInvalidToken(decoded.invalidTokenId);
            console.log(existInBlacklist)
            if(existInBlacklist === 1){
                return res.status(401).json({
                    status: "error",
                    message: "Expired refresh token"
                })
            }
            const user = await readUserByEmail(decoded?.email);
            const token = jwt.sign({ role: user?.role }, secretKey, { expiresIn: 60 });
            return res.status(200).json({
                status: "success",
                message: "Nuevo token de acceso generado",
                user: user?.email,
                token: token,
            })
        });
    }
    catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }

}