import { Request, Response, NextFunction } from "express";
import { Payload } from "../@types";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Redis } from "../database/config/redisConnection";

require('dotenv').config();

export async function authentication(req: Request, res: Response, next: NextFunction): Promise<Response | undefined | never> {
    try {
        const rawToken = (req.headers["authorization"]);
        const token = rawToken?.split(" ");
        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "No token provided"
            })
        }    
        const secretKey = String(process.env.SECRETKEY_JWT) ;
        jwt.verify(token[1], secretKey, async (err, decoded: any) => {
            if (err) {
                return res.status(401).json({
                    status: "error",
                    message: "No autentificado / token invalido"
                })
            }
            const existInBlacklist = await Redis.checkInvalidToken(decoded.invalidTokenId); //para las rutas que revocan el token de acceso actual, tales como logout o eliminar cuenta.
            // console.log(existInBlacklist)
            if(existInBlacklist === 1){
                return res.status(401).json({
                    status: "error",
                    message: "Expired access token"
                })
            }
            req.payload = decoded as Payload;
            next();
        });
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }
}

export async function authorization(req: Request, res: Response, next: NextFunction): Promise<Response | undefined | never> {
    try {
        if (!req.payload) {
            return res.status(401).json({
                status: "error",
                message: "No token provided"
            })

        }
        const decodedData = req.payload as JwtPayload;
        const role = decodedData.role;
        if(role !== "ADMIN"){
            return res.status(403).json({
                status: "error",
                message: "No autorizado"
            })            
        }
        next();
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        })
    }
}