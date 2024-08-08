import { Request, Response } from "express";
import { SimpleArticle } from "../interfaces/article.interface";
import { readAllArticles, readAllArticlesByPage, readArticleByAlias, saveArticle, updateArticleByAlias, deleteArticleByAlias } from "../services/articlesService";


export async function getAllArticles(req: Request, res: Response): Promise<Response | undefined> {
    try {
        const page = Number(req.query.page);
        if (page) {
            const limit: number = 5;
            const offset: number = (page - 1) * limit;
            const articulosData = await readAllArticlesByPage(limit, offset);
            const articulos = articulosData?.map(articulo => articulo = {
                ...articulo,
                endpoint: `${req.baseUrl}/${articulo.Alias}`
            })
            return res.status(200).json({
                status: "success",
                page: page,
                articulos: articulos?.length == 0 ? "No existe la página" : articulos
            });
        } else {
            const articulosData = await readAllArticles();
            const articulos = articulosData?.map(articulo => articulo = {
                ...articulo,
                endpoint: `${req.baseUrl}/${articulo.Alias}`
            })
            return res.status(200).json({
                status: "success",
                articulos: articulos?.length == 0 ? "No se encontraron artículos en la DB" : articulos
            })
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
export async function getArticlesByAlias(req: Request, res: Response): Promise<Response | undefined> {
    try {
        const { alias } = req.params;
        const article = await readArticleByAlias(alias);
        if (article) {
            return res.status(200).json({
                status: "success",
                article: article
            })
        }
        return res.status(404).json({
            status: "error",
            message: "El alias ingresado no existe"
        })
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
export async function createOneArticle(req: Request, res: Response): Promise<Response | undefined> { //manejar mejor el error de alias ya existente (en service)
    try {
        const created = await saveArticle(req.body);
        return res.status(201).json({
            status: "success",
            message: `El artículo con alias ${created.Alias} se creó con éxito`,
            endpoint: `${req.baseUrl}/${created.Alias}`
        })

    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}
export async function updateOneArticle(req: Request, res: Response): Promise<Response | undefined> {
    try {
        const {alias} = req.params;
        const articleToUpdate = await readArticleByAlias(alias); //logica al service???
        if (!articleToUpdate) {
            return res.status(404).json({
                status: "error",
                message: "El alias ingresado no existe"
            })
        }
        const updated = await updateArticleByAlias(req.body, alias);
        return res.status(201).json({
            status: "success",
            message: `El artículo con alias ${updated.Alias} se actualizó con éxito`,
            endpoint: `${req.baseUrl}/${updated.Alias}`
        })

    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}
export async function deleteOneArticle(req: Request, res: Response): Promise<Response | undefined> {
    try {
        const {alias} = req.params;
        const articleToDelete = await readArticleByAlias(alias); //logica al service???
        if (!articleToDelete) {
            return res.status(404).json({
                status: "error",
                message: "El alias ingresado no existe"
            })
        }
        const deleted = await deleteArticleByAlias(alias);
        return res.status(201).json({
            status: "success",
            message: `El artículo con alias ${deleted.Alias} se eliminó con éxito`,
        })

    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}


