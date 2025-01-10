import { SimpleArticle } from "../interfaces/article.interface";
import pool from "../database/config/connection";
import Prisma from "../database/config/prismaConnection";
import productos from "@prisma/client";
import { Redis } from "../database/config/redisConnection";

import { selectAllArticulos, selectAllArticulosByPage, selectArticleByAlias } from "../database/queries/articulos.sql";

export const articlesRepository = {

    DBreadAllArticles: async function (): Promise<SimpleArticle[] | undefined> {
        const redisArticles = await Redis.readRedisArticles();
        if (!redisArticles) {
            const articulos = await pool.query<SimpleArticle[]>(selectAllArticulos);
            await Redis.writeRedisArticles(articulos[0]);
            return articulos[0];
        }
        return redisArticles;
    },

    DBreadAllArticlesByPage: async function (limit?: number, offset?: number): Promise<SimpleArticle[] | undefined> {
        const articulos = await pool.query<SimpleArticle[]>(selectAllArticulosByPage, [limit, offset]);
        return articulos[0];
    },

    DBreadArticleByAlias: async function (alias: string): Promise<SimpleArticle | undefined> {
        const articulo = await pool.query<SimpleArticle[]>(selectArticleByAlias, [alias]);
        return articulo[0][0];
    },

    DBreadAllArticlesByMarca: async function (marca: string, limit?: number, offset?: number): Promise<productos.productos[] | SimpleArticle[] | undefined> {
        const articulos = await Prisma.productos.findMany({
            where: {
                Marca: marca
            },
            skip: offset,
            take: limit
        })
        return articulos;
    },

    DBsaveArticle: async function (data: SimpleArticle): Promise<productos.productos> { //check typo -- prisma generated types
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
            Categoria: data.Categoria,
            DescripcionTest: data.DescripcionTest
        };
        await Redis.deleteRedisArticles();
        return await Prisma.productos.create({
            data: newArticle
        });
    },

    DBupdateArticleByAlias: async function (data: SimpleArticle, alias: string): Promise<productos.productos> {
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
        await Redis.deleteRedisArticles();
        return await Prisma.productos.update({
            data: updatedArticle,
            where: {
                Alias: alias
            }
        })
    },

    DBdeleteArticleByAlias: async function (alias: string): Promise<productos.productos> {
        await Redis.deleteRedisArticles();
        return await Prisma.productos.delete({
            where: {
                Alias: alias
            }
        })
    }
}