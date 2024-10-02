import express from "express";
import { USER_ROLES } from "../constants";
import validate from "../middlewares/validation";
import { verifyTokenAndRole } from "../middlewares/validate.access";
import { login, updatePassword, createAdmin, updateAdmin } from "../controllers/auth.controller";
import { LoginSchema, createAdminSchema, updatePasswordSchema, updateAdminSchema } from "../schemas/users.schema";

const router = express.Router();

router.post("/login", validate(LoginSchema), login);

router.post(
	"/change-password",
	validate(updatePasswordSchema),
	verifyTokenAndRole(USER_ROLES.ADMIN),
	updatePassword
);

router.post("/create-admin", validate(createAdminSchema), createAdmin);

router.post(
	"/update-admin/:id",
	validate(updateAdminSchema),
	updateAdmin
);

export default router;