import express from "express";
import {
	createAdmin,
	createUser,
	getAdminById,
	getUserStats,
	login,
	updateAdmin,
	updatePassword,
} from "../controllers/auth.controller";
import validate from "../middlewares/validation";
import {
	LoginSchema,
    updateAdminSchema,
    createAdminSchema,
	updatePasswordSchema,
} from "../schemas/users.schema";
import { USER_ROLES } from "../constants";
import { verifyTokenAndRole } from "../middlewares/validate-access";

const router = express.Router();

router.post("/login", validate(LoginSchema), login);

router.post(
	"/change-password",
	validate(updatePasswordSchema),
	verifyTokenAndRole(USER_ROLES.ADMIN),
	updatePassword
);

router.post("/create-admin", validate(createAdminSchema), createAdmin);

router.get(
	"/get-admins/:id",
	verifyTokenAndRole(USER_ROLES.ADMIN),
	getAdminById
);

router.post(
	"/update-admin/:id",
	validate(updateAdminSchema),
	updateAdmin
);

export default router;