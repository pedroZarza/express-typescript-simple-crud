import {z} from "zod";

export const articleSchemaPost = z.object({
    Alias: z.string().min(1, {message: "Alias requerido"}),
    Numero_de_Parte: z.string().min(1, {message: "Número de parte requerido"}),
    Detalle: z.string(),
    Precio: z.number(),
    Moneda: z.string().toUpperCase(),
    Cotizacion: z.string(),
    Tasa_IVA: z.string(),
    Tasa_Impuestos_Internos: z.string(),
    Stock: z.number(),
    Marca: z.string().min(1),
    Categoria: z.string(),
    DescripcionTest: z.string().nullable(),
  
}).strict();

export const articleSchemaPut = z.object({
    Numero_de_Parte: z.string().min(1, {message: "Número de parte requerido"}).optional(),
    Detalle: z.string().optional(),
    Precio: z.number().optional(),
    Moneda: z.string().toUpperCase().optional(),
    Cotizacion: z.string().optional(),
    Tasa_IVA: z.string().optional(),
    Tasa_Impuestos_Internos: z.string().optional(),
    Stock: z.number().optional(),
    Marca: z.string().min(1).optional(),
    Categoria: z.string().optional(),
    DescripcionTest: z.string().nullable().optional(),
})


