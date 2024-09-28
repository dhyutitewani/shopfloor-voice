import express from "express";
// import authRoutes from "./auth.route";
import * as SuggestionsController from "../controllers/suggestionController";

const router = express.Router();

// router.use("/users", authRoutes);
router.get("/", SuggestionsController.getSuggestions);
router.post("/", SuggestionsController.createSuggestion);

router.get("*", function (req, res) {
	res.status(404).json({ error: "Page not found" });
});

export default router;