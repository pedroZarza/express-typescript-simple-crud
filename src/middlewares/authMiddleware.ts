import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
require('dotenv').config();

export async function authentication(req: Request, res: Response, next: NextFunction): Promise<Response | undefined | never> {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "No token provided"
            })
        }
        const secretKey = process.env.SECRETKEY_JWT || "clave_default";
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: "error",
                    message: "No autenticado"
                })
            }
            req.decodedPayload = decoded;
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
        if (!req.decodedPayload) {
            return res.status(401).json({
                status: "error",
                message: "No token provided"
            })
        }
        const decodedData = req.decodedPayload as JwtPayload;
        const role = decodedData.role;
        if(role !== "ADMIN"){
            return res.status(401).json({
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