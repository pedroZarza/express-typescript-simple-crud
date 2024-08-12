import { Router, Request, Response, application, request } from "express";

import { getAllArticles, getArticlesByAlias, createOneArticle, updateOneArticle, deleteOneArticle, getAllArticlesByMarca } from "../controllers/articlesController";
import { schemaValidator } from "../middlewares/validatorMiddleware";
import { articleSchemaPost, articleSchemaPut } from "../validationSchemas/articleValidationSchema";
import { authentication, authorization } from "../middlewares/authMiddleware";


const router = Router();

router.get("/", authentication, authorization, getAllArticles);

router.get("/:alias", getArticlesByAlias);

router.get("/marca/:marca", getAllArticlesByMarca);

router.post("/",authentication, authorization, schemaValidator(articleSchemaPost), createOneArticle);

router.put("/:alias",authentication, authorization, schemaValidator(articleSchemaPut), updateOneArticle);

router.delete("/:alias", authentication, authorization, deleteOneArticle);

export default router;