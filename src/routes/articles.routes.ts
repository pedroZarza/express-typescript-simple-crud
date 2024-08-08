import { Router, Request, Response, application, request } from "express";

import { getAllArticles, getArticlesByAlias, createOneArticle, updateOneArticle, deleteOneArticle } from "../controllers/articlesController";
import { articleValidator } from "../middlewares/validatorMiddleware";
import { articleSchemaPost, articleSchemaPut } from "../validationSchemas/articleValidationSchema";


const router = Router();

router.get("/", getAllArticles);
router.get("/:alias", getArticlesByAlias);
router.post("/", articleValidator(articleSchemaPost), createOneArticle);
router.put("/:alias", articleValidator(articleSchemaPut), updateOneArticle);
router.delete("/:alias", deleteOneArticle);

export default router;