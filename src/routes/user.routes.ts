import { Router } from "express";
import { createOneUser, login } from "../controllers/userController";
import { schemaValidator } from "../middlewares/validatorMiddleware";
import { userSchemaPost, userSchemaLogin } from "../validationSchemas/userValidationSchema";

const router = Router();

router.post("/", schemaValidator(userSchemaPost), createOneUser);
router.post("/login", schemaValidator(userSchemaLogin), login);


export default router;