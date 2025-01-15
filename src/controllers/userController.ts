import { Request, Response } from "express";
import { userService } from "../services/userService";
import { JwtPayload } from "jsonwebtoken";
import { HttpError } from "../utils/HttpErrorResponses";

require('dotenv').config();

export async function createUser(req: Request, res: Response): Promise<Response> {
    try {
        await userService.createUser(req.body);
        return res.status(201).json({
            status: "success",
            error: "El usuario ha sido registrado con éxito"
        });
    } catch (error: any) {
        if (error instanceof HttpError) return res.status(error.statusCode).json({ status: "error", error: error.message });
        return res.status(500).json({ status: "error", error: error.message });
    }
}
export async function login(req: Request, res: Response): Promise<Response> {
    try {
        const { email } = req.body
        const { password } = req.body;
        const loginInfo = await userService.loginProcess(email, password);
        res.cookie("refreshToken", loginInfo.refreshToken, { maxAge: (3600000 * 24) * 30, signed: true, httpOnly: true });  //(3600000*24)*30
        return res.status(200).json({
            status: "success",
            message: "Usuario autenticado",
            user: email,
            token: loginInfo.token,
        })
    } catch (error: any) {
        if (error instanceof HttpError) return res.status(error.statusCode).json({ status: "error", error: error.message });
        return res.status(500).json({ status: "error", error: "Internal server error" });
    }
}

export async function logout(req: Request, res: Response): Promise<Response> {
    try {
        const refreshToken: string = req.signedCookies["refreshToken"];
        await userService.logoutProcess(refreshToken);
        res.clearCookie("refreshToken");
        return res.status(200).json({
            status: "success",
            message: "Token de sesión eliminado"
        })
    } catch (error: any) {
        if (error instanceof HttpError) return res.status(error.statusCode).json({ status: "error", error: error.message });
        return res.status(500).json({ status: "error", error: "Internal server error" });
    }
}

export async function updateUserInfoByEmail(req: Request, res: Response): Promise<Response | undefined> {
    try {
        const payload = req.payload as JwtPayload;
        const updated = await userService.updateUserInfo(req.body, payload.email);
        return res.status(200).json({
            status: "success",
            message: `La información del usuario ${updated.email} se actualizó con éxito`,
        })
    } catch (error: any) {
        if (error instanceof HttpError) return res.status(error.statusCode).json({ status: "error", error: error.message });
        return res.status(500).json({ status: "error", error: "Internal server error" });
    }
}

export async function changePassword(req: Request, res: Response): Promise<Response> {
    try {
        const { previousPassword, newPassword } = req.body;
        const payload = req.payload as JwtPayload;
        const updated = await userService.updateUserPassword(previousPassword, newPassword, payload.email);
        return res.status(200).json({
            status: "success",
            message: `La contraseña del usuario ${updated.email} se actualizó con éxito`,
        })
    } catch (error: any) {
        if (error instanceof HttpError) return res.status(error.statusCode).json({ status: "error", error: error.message });
        return res.status(500).json({ status: "error", error: "Internal server error" });
    }
}

export async function deleteAccount(req: Request, res: Response): Promise<Response> {
    try {
        const { password } = req.body;
        const payload = req.payload as JwtPayload;
        const refreshToken: string = req.signedCookies["refreshToken"];
        await userService.deleteUser(password, payload.email, refreshToken);
        res.clearCookie("refreshToken");
        return res.status(200).json({
            status: "success",
            message: "Cuenta eliminada"
        })
    } catch (error: any) {
        if (error instanceof HttpError) return res.status(error.statusCode).json({ status: "error", error: error.message });
        return res.status(500).json({ status: "error", error: error.message});
    }
}
