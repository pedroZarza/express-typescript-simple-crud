import {SimpleUser } from "../interfaces/user.interface";
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