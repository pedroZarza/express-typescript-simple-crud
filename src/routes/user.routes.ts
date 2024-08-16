import { Router } from "express";
import { createOneUser, login, logout } from "../controllers/userController";
import { schemaValidator } from "../middlewares/validatorMiddleware";
import { userSchemaPost, userSchemaLogin } from "../validationSchemas/userValidationSchema";
import { refreshToken } from "../middlewares/refreshToken";

const router = Router();

router.post("/", schemaValidator(userSchemaPost), createOneUser);
router.post("/login", schemaValidator(userSchemaLogin), login);
router.post("/logout", logout);
router.post("/refreshToken", refreshToken);
// router.put("/", )



export default router;