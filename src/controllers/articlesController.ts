import { Request, Response } from "express";
import { articlesService } from "../services/articlesService";
import { HttpError } from "../utils/HttpErrorResponses";

export const articlesController = {

    getAllArticles: async function (req: Request, res: Response): Promise<Response | undefined> {
        try {
            const page = Number(req.query.page)
            const articulos = await articlesService.readArticles(page);
            return res.status(200).json({
                status: "success",
                page: page ? page : "All",
                articulos: articulos?.length === 0 ? "No se encontraron artículos en la DB" : articulos
            })
        }
        catch (error: any) {
            if (error instanceof HttpError) return res.status(error.statusCode).json({ status: "error", message: error.message });
            return res.status(500).json({ status: "error", message: "Internal server error" });
        }
    },

    getArticlesByAlias: async function (req: Request, res: Response): Promise<Response | undefined> {
        try {
            const { alias } = req.params;
            const article = await articlesService.readArticleByAlias(alias);
            return res.status(200).json({
                status: "success",
                article: article
            })
        } catch (error: any) {
            if (error instanceof HttpError) return res.status(error.statusCode).json({ status: "error", message: error.message });
            return res.status(500).json({ status: "error", message: "Internal server error" });
        }
    },

    getAllArticlesByMarca: async function (req: Request, res: Response): Promise<Response | undefined> {
        try {
            const page = Number(req.query.page);
            const { marca } = req.params;
            const articulos = await articlesService.readArticlesByMarca(page, marca);
            return res.status(200).json({
                status: "success",
                marca: marca,
                page: page || "All",
                articulos: articulos?.length === 0 ? `Page out of range` : articulos
            });
        }
        catch (error: any) {
            if (error instanceof HttpError) return res.status(error.statusCode).json({ status: "error", message: error.message });
            return res.status(500).json({ status: "error", message: "Internal server error" });
        }
    },

    createOneArticle: async function (req: Request, res: Response): Promise<Response | undefined> { //manejar mejor el error de alias ya existente (en service)
        try {
            const created = await articlesService.saveNewArticle(req.body);
            return res.status(201).json({
                status: "success",
                message: `El artículo con alias ${created.Alias} se creó con éxito`,
                endpoint: `${req.baseUrl}/${created.Alias}`
            })
        } catch (error: any) {
            if (error instanceof HttpError) return res.status(error.statusCode).json({ status: "error", message: error.message });
            return res.status(500).json({ status: "error", message: "Internal server error" });
        }
    },

    updateOneArticle: async function (req: Request, res: Response): Promise<Response | undefined> {
        try {
            const { alias } = req.params;
            const updated = await articlesService.updateArticle(req.body, alias);
            return res.status(200).json({
                status: "success",
                message: `El artículo con alias ${updated.Alias} se actualizó con éxito`,
                endpoint: `${req.baseUrl}/${updated.Alias}`
            })
        } catch (error: any) {
            if (error instanceof HttpError) return res.status(error.statusCode).json({ status: "error", message: error.message });
            return res.status(500).json({ status: "error", message: "Internal server error" });
        }
    },
    
    deleteOneArticle: async function (req: Request, res: Response): Promise<Response | undefined> {
        try {
            const { alias } = req.params;
            const deleted = await articlesService.deleteArticle(alias);
            return res.status(200).json({
                status: "success",
                message: `El artículo con alias ${deleted.Alias} se eliminó con éxito`,
            })
        } catch (error: any) {
            if (error instanceof HttpError) return res.status(error.statusCode).json({ status: "error", message: error.message });
            return res.status(500).json({ status: "error", message: "Internal server error" });
        }
    }
}





