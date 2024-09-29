import express from "express";
import authRoutes from "./auth.routes";
import { login } from "../controllers/auth.controller";
import * as SuggestionsController from "../controllers/suggestionController";

const router = express.Router();

router.use("/users", authRoutes);

router.get("/", SuggestionsController.getSuggestions);
router.post("/", SuggestionsController.createSuggestion);

router.post("/admin/login", login);

// Secure route example
router.get("/admin/viewSuggestions", SuggestionsController.getSuggestions); // Replace with your existing function


router.get("*", function (req, res) {
	res.status(404).json({ error: "Page not found" });
});

export default router;