import express from "express";
import authRoutes from "./auth.routes";
import { login } from "../controllers/auth.controller";
import { verifyTokenAndRole } from "../middlewares/validate.access";
import * as SuggestionsController from "../controllers/suggestion.controller";

const router = express.Router();
// router.use("/admin", authRoutes);

router.get("/", SuggestionsController.getSuggestions);
router.post("/", SuggestionsController.createSuggestion);
router.delete("/:id", SuggestionsController.deleteSuggestion);

router.get("*", function (req, res) {
	res.status(404).json({ error: "Page not found" });
});

export default router;