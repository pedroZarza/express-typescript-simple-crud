import { Request, Response } from "express";
import { SimpleUser } from "../interfaces/user.interface";
import { readUserByEmail, saveUser } from "../services/userService";
import { compareSync, hash, hashSync } from 'bcryptjs';
import jwt from "jsonwebtoken";
require('dotenv').config();

export async function createOneUser(req: Request, res: Response): Promise< Response | undefined> {
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
export async function login(req: Request, res: Response): Promise<Response | undefined > {
    try {
        const {email} = req.body
        const {password} = req.body;
        const user = await readUserByEmail(email);
        if(!user){
            return res.status(404).json({
                status: "error",
                message: `El email ${email} no está registrado`
            })
        }
        if(compareSync(password, user.password)){
            const secretKey = String(process.env.SECRETKEY_JWT);
            const token = jwt.sign({role: user.role}, secretKey, {expiresIn: 60 * 30});
            return res.status(200).json({
                status: "success",
                message: "Usuario autenticado",
                user: user.email,
                token: token
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