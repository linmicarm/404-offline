import express from "express";
import {
  getSuggestions,
  createSuggestion,
  updateSuggestionStatus,
} from "../controllers/suggestionController.js";

const router = express.Router();

router.get("/", getSuggestions);
router.post("/", createSuggestion);
router.patch("/:id", updateSuggestionStatus);

export default router;