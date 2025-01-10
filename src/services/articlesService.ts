import { SimpleArticle } from "../interfaces/article.interface";
import { articlesRepository } from "../repositories/articles.repository"
import { ErrorFactory } from "../utils/HttpErrorResponses";

export const articlesService = {
    readArticles: async function (page: number | undefined): Promise<SimpleArticle[] | undefined> {
        try {
            if (page) {
                const limit: number = 5;
                const offset: number = (page - 1) * limit;
                const articulos = await articlesRepository.DBreadAllArticlesByPage(limit, offset);
                return articulos;
            } else {
                const articulos = await articlesRepository.DBreadAllArticles();
                return articulos;
            }
        } catch (error: any) {
            throw ErrorFactory.createError(500);
        }
    },

    readArticleByAlias: async function (alias: string): Promise<SimpleArticle> {
        try {
            const article = await articlesRepository.DBreadArticleByAlias(alias);
            if (!article) {
                throw ErrorFactory.createError(404, "El alias ingresado no existe");
            }
            return article;
        } catch (error) {
            throw error
        }
    },

    readArticlesByMarca: async function (page: number, marca: string): Promise<SimpleArticle[] | undefined> {
        try { 
            const articles = await articlesRepository.DBreadAllArticlesByMarca(marca) as SimpleArticle[];
            if(articles?.length === 0){
                throw ErrorFactory.createError(404, `Marca ${marca} no encontrada`);
            }
            if (page) {
                const limit: number = 5;
                const offset: number = (page - 1) * limit;
                const articles = await articlesRepository.DBreadAllArticlesByMarca(marca, limit, offset) as SimpleArticle[];
                return articles;
            } else {
                return articles;
            }
        } catch (error) {
            throw error;
        }
    },

    saveNewArticle: async function (articleData: SimpleArticle): Promise<any> {
        try {
            const aliasExist = await articlesRepository.DBreadArticleByAlias(articleData.Alias);
            if(aliasExist) throw ErrorFactory.createError(409, "El alias ingresado ya existe en la base de datos");
            return await articlesRepository.DBsaveArticle(articleData);
        } catch (error) {
            throw error;    
        }
    },

    updateArticle: async function (articleData: SimpleArticle, alias: string): Promise<any> {
        try {
            const aliasExist = await articlesRepository.DBreadArticleByAlias(alias);
            if(!aliasExist) throw ErrorFactory.createError(404, "El alias ingresado no existe en la base de datos");
            return await articlesRepository.DBupdateArticleByAlias(articleData, alias);
        } catch (error) {
            throw error;    
        }
    },

    deleteArticle: async function (alias: string): Promise<any> {
        try {
            const aliasExist = await articlesRepository.DBreadArticleByAlias(alias);
            if(!aliasExist) throw ErrorFactory.createError(404, "El alias ingresado no existe en la base de datos");
            return await articlesRepository.DBdeleteArticleByAlias(alias);
        } catch (error) {
            throw error;    
        }
    }
}


