import { SimpleUser } from "../interfaces/user.interface";
import Prisma from "../database/config/prismaConnection";
import { users } from "@prisma/client";
import { hash, hashSync } from 'bcryptjs';


export async function readUserByEmail(email: string) {
    try {
        const user = await Prisma.users.findUnique({ where: { email: email } });
        return user;
    } catch (error) {
        throw new Error("Error interno del servidor");
    }
}

export async function saveUser(data: SimpleUser): Promise<users | undefined | null> {
    try {
        const user = await readUserByEmail(data.email);
        if (user) return null;
        const newUser = {
            email: data.email,
            name: data.name,
            role: data.role,
            password: hashSync(data.password, 10)
        }
        return await Prisma.users.create({
            data: newUser
        })
    } catch (error) {
        throw new Error("Error al crear un usuario");
    }
}
export async function updateUserInfo(data: SimpleUser, email: string): Promise<users | undefined | null> {
    try { 
        const user = await readUserByEmail(email);
        if (!user) return null;
        const updatedUser: Omit<SimpleUser, "email" | "password" | "confirmPassword"> = {
            name: data.name,
            role: data.role
        }
        return await Prisma.users.update({
            data: updatedUser,
            where: {
                email: email,
            }
        })
    } catch (error) {
        throw new Error("Error al intentar actualizar la información del usuario");
    }
}
export async function updateUserPassword(newPassword: string , email: string): Promise<users> {
    try {
        const updatedPassword = {
            password: hashSync(newPassword, 10)
        }
        return await Prisma.users.update({
            data: updatedPassword,
            where: {
                email: email
            }
        })
    } catch (error) {
        throw new Error("Error al intentar cambiar la contraseña del usuario");
    }
}