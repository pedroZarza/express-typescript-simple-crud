import { Router, Request, Response, application, request } from "express";

import { getAllArticles, getArticlesByAlias, createOneArticle, updateOneArticle, deleteOneArticle, getAllArticlesByMarca } from "../controllers/articlesController";
import { schemaValidator } from "../middlewares/validatorMiddleware";
import { articleSchemaPost, articleSchemaPut } from "../validationSchemas/articleValidationSchema";


const router = Router();

router.get("/", getAllArticles);

router.get("/:alias", getArticlesByAlias);

router.get("/marca/:marca", getAllArticlesByMarca);

router.post("/", schemaValidator(articleSchemaPost), createOneArticle);

router.put("/:alias", schemaValidator(articleSchemaPut), updateOneArticle);

router.delete("/:alias", deleteOneArticle);

export default router;