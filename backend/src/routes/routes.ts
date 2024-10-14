import express from "express";
import * as SuggestionsController from "../controllers/suggestion.controller";

const router = express.Router();

router.get("/", SuggestionsController.getSuggestions);
router.post("/", SuggestionsController.createSuggestion);
router.delete("/:id", SuggestionsController.deleteSuggestion);
router.put("/:id/:status", SuggestionsController.markSuggestion);

router.get("*", function (req, res) {
	res.status(404).json({ error: "Page not found" });
});

export default router;