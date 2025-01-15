import { SimpleUser } from "../interfaces/user.interface";
import { users } from "@prisma/client";

import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { compareSync, hashSync } from 'bcryptjs';
import { Redis } from "../database/config/redisConnection";
import { userRepository } from "../repositories/user.repository";
import { ErrorFactory } from "../utils/HttpErrorResponses";

export const userService = {

    createUser: async function (user: SimpleUser): Promise<users> {
        const userExist = await userRepository.DBreadUserByEmailAll(user.email);
        if (userExist) throw ErrorFactory.createError(409, "El email ingresado ya está registrado");
        const newUser = {
            email: user.email,
            name: user.name,
            role: user.role,
            password: hashSync(user.password, 10)
        }
        return await userRepository.DBsaveUser(newUser);
    },

    loginProcess: async function (email: string, password: string): Promise<{ token: string, refreshToken: string }> {
        const user = await userRepository.DBreadUserByEmail(email);
        if (!user) throw ErrorFactory.createError(404, "El email ingresado no está registrado");
        if (compareSync(password, user.password)) {
            const secretKey = String(process.env.SECRETKEY_JWT);
            return {
                token: jwt.sign({ role: user.role, email: user.email, invalidTokenId: uuidv4() }, secretKey, { expiresIn: 60 * 15 }),
                refreshToken: jwt.sign({ email: user.email, invalidTokenId: uuidv4() }, secretKey, { expiresIn: "30d" })
            }
        }
        throw ErrorFactory.createError(401, "Credenciales incorrectas");
    },

    logoutProcess: async function (refreshToken: string | undefined): Promise<any> {
        if (!refreshToken) {
            throw ErrorFactory.createError(409, "No active refresh token");
        }
        const secretKey = String(process.env.SECRETKEY_JWT);
        const refreshPayload: any = jwt.verify(refreshToken, secretKey);
        return await Redis.writeInvalidToken(refreshToken, refreshPayload.invalidTokenId);
    },

    updateUserInfo: async function (user: SimpleUser, email: string): Promise<users> {
        const userToUpdate = await userRepository.DBreadUserByEmail(email);
        if (!userToUpdate) throw ErrorFactory.createError(404, "El usuario no existe");
        const updatedUser = {
            name: user.name,
            role: user.role
        }
        return await userRepository.DBupdateUserInfo(updatedUser, email);
    },

    updateUserPassword: async function (previousPassword: string, newPassword: string, email: string): Promise<users> {
        const user = await userRepository.DBreadUserByEmail(email) as SimpleUser;
        const previousPassCheck = compareSync(previousPassword, user.password);
        if (!previousPassCheck) throw ErrorFactory.createError(403, "La contraseña anterior es incorrecta");
        const hashNewPassword = hashSync(newPassword, 10);
        return await userRepository.DBupdateUserPassword(hashNewPassword, email);
    },

    deleteUser: async function (password: string, email: string, refreshToken: string): Promise<users> {
        const user = await userRepository.DBreadUserByEmail(email) as SimpleUser;
        if (!user) throw ErrorFactory.createError(404, "El email ingresado no está registrado");
        const checkPass = compareSync(password, user.password);
        if (!checkPass) throw ErrorFactory.createError(401, "Contraseña incorrecta");
        const secretKey = String(process.env.SECRETKEY_JWT);
        const tokenPayload: any = jwt.verify(refreshToken, secretKey);
        await Redis.writeInvalidToken(refreshToken, tokenPayload.invalidTokenId);
        return userRepository.DBdeleteUser(email);
    }
}

