import { Router } from "express";
import { createOneUser, login, logout, updateUserInfoByEmail, changePassword, deleteAccount} from "../controllers/userController";
import { schemaValidator } from "../middlewares/validatorMiddleware";
import { userSchemaPost, userSchemaLogin, userSchemaPut, userChangePassSchema, userDeleteAccount} from "../validationSchemas/userValidationSchema";
import { refreshToken } from "../middlewares/refreshToken";
import { authentication } from "../middlewares/authMiddleware";
import { revokeAccessToken } from "../middlewares/revokeAccessToken";

const router = Router();

router.post("/", schemaValidator(userSchemaPost), createOneUser);

router.post("/login", schemaValidator(userSchemaLogin), login);

router.post("/logout", authentication, revokeAccessToken, logout);

router.post("/refresh-token", refreshToken);

router.put("/", authentication, schemaValidator(userSchemaPut), updateUserInfoByEmail);

router.put("/change-password", authentication, schemaValidator(userChangePassSchema), changePassword);

router.delete("/delete-account", authentication , schemaValidator(userDeleteAccount), revokeAccessToken, deleteAccount);

export default router;