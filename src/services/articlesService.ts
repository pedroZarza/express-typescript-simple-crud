import { SimpleArticle } from "../interfaces/article.interface";
import pool from "../database/config/connection";

import Prisma from "../database/config/prismaConnection";
import productos from "@prisma/client";
import { RowDataPacket } from "mysql2"

import { selectAllArticulos, selectAllArticulosByPage, selectArticleByAlias } from "../database/articulos.sql";

export async function readAllArticles(): Promise<SimpleArticle[] | undefined> {
    try {
        const articulos = await pool.query<SimpleArticle[]>(selectAllArticulos);
        return articulos[0];

    } catch (error) {
        throw new Error("Error interno del servidor");
    }
}
export async function readAllArticlesByPage(limit?: number, offset?: number): Promise<SimpleArticle[] | undefined> {
    try {
        const articulos = await pool.query<SimpleArticle[]>(selectAllArticulosByPage, [limit, offset]);
        return articulos[0];

    } catch (error) {
        throw new Error("Error interno del servidor");
    }
}
export async function readArticleByAlias(alias: string): Promise<SimpleArticle | undefined> {
    try {
        const articulo = await pool.query<SimpleArticle[]>(selectArticleByAlias, [alias]);
        return articulo[0][0];//ver si hay otra manera de que la query te de un objeto directamente.

    } catch (error) {
        throw new Error("Error interno del servidor");
    }
}
export async function saveArticle(data: SimpleArticle): Promise<productos.productos> { //check typo -- prisma generated types
    try {
        const newArticle = {
            Alias: data.Alias,
            Numero_de_Parte: data.Numero_de_Parte,
            Detalle: data.Detalle,
            Precio: data.Precio,
            Moneda: data.Moneda,
            Cotizacion: data.Cotizacion,
            Tasa_IVA: data.Tasa_IVA,
            Tasa_Impuestos_Internos: data.Tasa_Impuestos_Internos,
            Stock: data.Stock,
            Marca: data.Marca,
            Categoria: data.Marca,
            DescripcionTest: data.DescripcionTest
        };
        return await Prisma.productos.create({
            data: newArticle
        });
    } catch (error) {
        throw new Error("Error al crear el artículo");
    }

}
export async function updateArticleByAlias(data: SimpleArticle, alias: string): Promise<productos.productos> {
    try {
        const updatedArticle = {
            Numero_de_Parte: data.Numero_de_Parte,
            Detalle: data.Detalle,
            Precio: data.Precio,
            Moneda: data.Moneda,
            Cotizacion: data.Cotizacion,
            Tasa_IVA: data.Tasa_IVA,
            Tasa_Impuestos_Internos: data.Tasa_Impuestos_Internos,
            Stock: data.Stock,
            Marca: data.Marca,
            Categoria: data.Marca,
            DescripcionTest: data.DescripcionTest
        };
        return await Prisma.productos.update({
            data: updatedArticle,
            where: {
                Alias: alias
            }
        })

    } catch (error) {
        throw new Error("Error al actualizar el artículo");
    }
}
export async function deleteArticleByAlias(alias: string): Promise<productos.productos> {
    try {
        return await Prisma.productos.delete({
            where: {
                Alias: alias
            }
        })
    } catch (error) {
        throw new Error("Error al eliminar el artículo");
    }
}

