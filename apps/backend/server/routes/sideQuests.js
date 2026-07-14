import express from "express";
import {
  getAllSideQuests,
  getSideQuestById,
  createSideQuest,
  updateSideQuest,
  deleteSideQuest,
} from "../controllers/sideQuestController.js";

const router = express.Router();

router.get("/", getAllSideQuests);
router.get("/:id", getSideQuestById);
router.post("/", createSideQuest);
router.put("/:id", updateSideQuest);
router.delete("/:id", deleteSideQuest);

export default router;