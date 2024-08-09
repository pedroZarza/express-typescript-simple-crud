import { Router } from "express";
import { createOneUser } from "../controllers/userController";
import { schemaValidator } from "../middlewares/validatorMiddleware";
import { userSchemaPost } from "../validationSchemas/userValidationSchema";

const router = Router();

router.post("/create", schemaValidator(userSchemaPost), createOneUser);
router.post("/login",)


export default router;