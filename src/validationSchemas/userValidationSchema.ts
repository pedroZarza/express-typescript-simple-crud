import { string, z } from "zod";
import { ROLE } from "../interfaces/user.interface";

export const userSchemaPost = z.object({
    email: z.string().email().trim().min(1, "Email requerido"),
    name: z.string().trim().min(1, "Nombre requerido"),
    role: z.nativeEnum(ROLE).optional(),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string()
}).strict().refine(data => data.password === data.confirmPassword, { message: "Las contraseñas no coinciden", path: ["confirmación de contraseña"]});

export const userSchemaPut = z.object({
    name: z.string().trim().min(1, "Nombre requerido").optional(),
    role: z.nativeEnum(ROLE).optional(),
}).strict();

export const userSchemaLogin = z.object ({
    email: z.string().email().trim().min(1, "Email requerido"),
    password: z.string()
}).strict();

export const userChangePassSchema = z.object({
    previousPassword: z.string().trim(),
    newPassword: z.string().trim().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmNewPassword: z.string().trim()
}).strict().refine(data => data.newPassword === data.confirmNewPassword, { message: "Las contraseñas no coinciden", path: ["Confirmación de la nueva contraseña"]});

