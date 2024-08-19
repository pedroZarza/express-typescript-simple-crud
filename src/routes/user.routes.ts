import { Router } from "express";
import { createOneUser, login, logout, updateUserInfoByEmail, changePassword} from "../controllers/userController";
import { schemaValidator } from "../middlewares/validatorMiddleware";
import { userSchemaPost, userSchemaLogin, userSchemaPut, userChangePassSchema} from "../validationSchemas/userValidationSchema";
import { refreshToken } from "../middlewares/refreshToken";
import { authentication } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", schemaValidator(userSchemaPost), createOneUser);

router.post("/login", schemaValidator(userSchemaLogin), login);

router.post("/logout", logout);

router.post("/refreshToken", refreshToken);

router.put("/", authentication, schemaValidator(userSchemaPut), updateUserInfoByEmail);

router.put("/change-password", authentication, schemaValidator(userChangePassSchema), changePassword);

export default router;