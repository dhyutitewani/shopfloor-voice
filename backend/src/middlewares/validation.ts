import { ZodError, Schema } from "zod";
import { NextFunction, Request, Response } from "express";

const validate =
	(schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
		try {
			const validatedData = schema.parse(req.body);
			req.body = validatedData; // Update req.body with validated data

			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errorMessages = error.errors
					.map((err) => err.path[0] + " : " + err.message)
					.join(", ");
				console.error(errorMessages);
				return res.status(400).json({
					message: error.errors
						.map((err) => err.path[0] + " : " + err.message)
						.join(", "),
				}); // Return validation errors
			}
			next(error); // Pass on other errors
		}
	};

export const validateQuery =
	(schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
		try {
			const validatedData = schema.parse(req.query);
			req.body = validatedData; // Update req.body with validated data

			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errorMessages = error.errors
					.map((err) => err.path[0] + " : " + err.message)
					.join(", ");
				console.error(errorMessages);
				return res.status(400).json({
					message: error.errors
						.map((err) => err.path[0] + " : " + err.message)
						.join(", "),
				}); // Return validation errors
			}
			next(error); // Pass on other errors
		}
	};

export default validate;
