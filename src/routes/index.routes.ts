import { Router, Request, Response, application } from "express";

import articlesRouter from "./articles.routes";
const router = Router();

router.use("/articulos", articlesRouter);

export default router;