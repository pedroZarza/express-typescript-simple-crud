import { string, z } from "zod";
import { ROLE } from "../interfaces/user.interface";

export const userSchemaPost = z.object({
    email: z.string().email().trim().min(1, "Email requerido"),
    name: z.string().trim().min(1, "Nombre requerido"),
    role: z.nativeEnum(ROLE).optional(),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: string()
}).strict().refine(data => data.password === data.confirmPassword, { message: "Las contraseñas no coinciden", path: ["confirmación de contraseña"]});