import { Request, Response } from "express";
import { SimpleUser } from "../interfaces/user.interface";
import { readUserByEmail, saveUser } from "../services/userService";
import { compareSync, hash, hashSync } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";
import { Redis } from "../database/config/redisConnection";


require('dotenv').config();

export async function createOneUser(req: Request, res: Response): Promise<Response | undefined> {
    try {
        const created = await saveUser(req.body);
        if (!created) {
            return res.status(409).json({
                status: "error",
                message: "El email ya está registrado"
            })
        }
        return res.status(201).json({
            status: "success",
            message: "El usuario ha sido registrado con éxito"
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
export async function login(req: Request, res: Response): Promise<Response | undefined> {
    try {
        const { email } = req.body
        const { password } = req.body;
        const user = await readUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: `El email ${email} no está registrado`
            })
        }
        if (compareSync(password, user.password)) {
            const secretKey = String(process.env.SECRETKEY_JWT);
            const token = jwt.sign({ role: user.role }, secretKey, { expiresIn: 60 });
            const refreshToken = jwt.sign({ email: user.email, invalidTokenId: uuidv4()}, secretKey, { expiresIn: "30d" });
            console.log(refreshToken)
            res.cookie("refreshToken", refreshToken, { maxAge: (3600000 * 24) * 30, signed: false });  //(3600000*24)*30
            return res.status(200).json({
                status: "success",
                message: "Usuario autenticado",
                user: user.email,
                token: token,
            })
        } else {
            return res.status(401).json({
                status: "error",
                message: "Credenciales incorrectas"
            })
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
export async function logout(req: Request, res: Response): Promise<Response | undefined> {
    try {
        const refreshToken: string = req.cookies["refreshToken"];
        if(!refreshToken){
            return res.status(409).json({
                status: "error",
                message: "No active refresh token"
            })
        }
        const secretKey = String(process.env.SECRETKEY_JWT);
        const tokenPayload: any = jwt.verify(refreshToken, secretKey);
        await Redis.writeInvalidToken(refreshToken, tokenPayload.invalidTokenId);
        res.clearCookie("refreshToken");
        return res.status(200).json({
            status: "success",
            message: "Token de sesión eliminado"
        })
    } catch (error: any) {
        res.status(500).json({ error: "Error interno del servidor" });
    }

}
