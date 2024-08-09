import { ROLE, SimpleUser } from "../interfaces/user.interface";
import Prisma from "../database/config/prismaConnection";
import { hash } from 'bcryptjs';


export async function saveUser(data: SimpleUser): Promise<SimpleUser | undefined | null> {
    try {

        const user = await Prisma.users.findUnique({where: { email: data.email}});
        if(user) return null;
        const newUser = {
            email: data.email,
            name: data.name,
            role: data.role,
            password: hash(data.password, 10)
        }
        
        return createdUser 
    } catch (error) {
        throw new Error("Error al crear un usuario");
        
    }
}