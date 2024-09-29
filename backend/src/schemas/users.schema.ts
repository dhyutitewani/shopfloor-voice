import { z } from "zod";

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(50),
});

export const updatePasswordSchema = z.object({
	currentPassword: z.string().min(6).max(50),
	newPassword: z.string().min(6).max(50),
});

export const createAdminSchema = z.object({
	firstName: z.string().min(2).max(255),
	lastName: z.string().min(2).max(255),
	email: z.string().email(),
	phone: z.string().min(6).max(20),
	active: z.boolean(),
	plantId: z.string(),
});

export const updateAdminSchema = z.object({
	firstName: z.string().min(2).max(255),
	lastName: z.string().min(2).max(255),
	email: z.string().email().optional(),
	phone: z.string().min(6).max(20).optional(),
	active: z.boolean().optional(),
	role: z.enum(["ADMIN", "MANAGER", "VIEWER", "SUPER_ADMIN"]),
	plantId: z.string(),
});