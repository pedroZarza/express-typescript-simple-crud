import { Router } from "express";
import { changePassword, createUser, login, logout, updateUserInfoByEmail, deleteAccount } from "../controllers/userController";
import { refreshToken } from "../middlewares/refreshToken";
import { schemaValidator } from "../middlewares/validatorMiddleware";
import { userSchemaPost, userSchemaLogin, userSchemaPut, userChangePassSchema, userDeleteAccount} from "../validationSchemas/userValidationSchema";
import { authentication } from "../middlewares/authMiddleware";
import { revokeAccessToken } from "../middlewares/revokeAccessToken";

const router = Router();

router.post("/", schemaValidator(userSchemaPost), createUser);

router.post("/login", schemaValidator(userSchemaLogin), login);

router.post("/logout", authentication, revokeAccessToken, logout);

router.post("/refresh-token", refreshToken);

router.put("/", authentication, schemaValidator(userSchemaPut), revokeAccessToken, updateUserInfoByEmail);

router.put("/change-password", authentication, schemaValidator(userChangePassSchema), changePassword);

router.delete("/delete-account", authentication , schemaValidator(userDeleteAccount), deleteAccount, revokeAccessToken);

export default router;