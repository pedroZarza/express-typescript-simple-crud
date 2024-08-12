import { Router, Request, Response, application } from "express";

import articlesRouter from "./articles.routes";
import userRouter from "./user.routes";
const router = Router();

router.use("/articulos", articlesRouter);
router.use("/users", userRouter);

export default router;