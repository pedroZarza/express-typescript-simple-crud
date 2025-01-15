import { SimpleUser } from "../interfaces/user.interface";
import Prisma from "../database/config/prismaConnection";
import { users } from "@prisma/client";

export const userRepository = {

    DBreadUserByEmail: async function (email: string): Promise<users | null> {
        const user = await Prisma.users.findUnique({ where: { email: email, deletedAt: null } });
        return user;
    },

    DBreadUserByEmailAll: async function (email: string): Promise<users | null> {
        const user = await Prisma.users.findUnique({ where: { email: email } });
        return user;
    },

    DBsaveUser: async function (data: SimpleUser): Promise<users> {
        return await Prisma.users.create({
            data: data
        })
    },

    DBupdateUserInfo: async function (data: Omit<SimpleUser, "email" | "password" | "confirmPassword">, email: string): Promise<users> {
        return await Prisma.users.update({
            data: data,
            where: {
                email: email,
            }
        })
    },

    DBupdateUserPassword: async function (newPassword: string, email: string): Promise<users> {
        return await Prisma.users.update({
            data: {
                password: newPassword
            },
            where: {
                email: email
            }
        })
    },

    DBdeleteUser: async function (email: string): Promise<users> {
        return await Prisma.users.update({
            data: {
                deletedAt: new Date()
            },
            where: {
                email: email
            }
        })
    }
}