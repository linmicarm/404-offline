import express from "express";
import {
  getCommentsByQuest,
  createComment,
  deleteComment,
  updateComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/:sideQuestId/comments", getCommentsByQuest);
router.post("/:sideQuestId/comments", createComment);
router.put("/comments/:id", updateComment);
router.delete("/comments/:id", deleteComment);

export default router;