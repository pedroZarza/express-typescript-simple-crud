import { Router } from "express";

import { articlesController } from "../controllers/articlesController";
import { schemaValidator } from "../middlewares/validatorMiddleware";
import { articleSchemaPost, articleSchemaPut } from "../validationSchemas/articleValidationSchema";
import { authentication, authorization } from "../middlewares/authMiddleware";


const router = Router();

router.get("/", authentication, authorization, articlesController.getAllArticles);

router.get("/:alias", authentication, articlesController.getArticlesByAlias);

router.get("/marca/:marca", authentication, articlesController.getAllArticlesByMarca);

router.post("/",authentication, authorization, schemaValidator(articleSchemaPost), articlesController.createOneArticle);

router.put("/:alias",authentication, authorization, schemaValidator(articleSchemaPut), articlesController.updateOneArticle);

router.delete("/:alias", authentication, authorization, articlesController.deleteOneArticle);

export default router;