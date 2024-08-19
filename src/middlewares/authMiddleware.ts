import { Request, Response, NextFunction } from "express";
import { Payload } from "../@types";
import jwt, { JwtPayload } from "jsonwebtoken";

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
        jwt.verify(token[1], secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: "error",
                    message: "Error de autentificación, token inválido"
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