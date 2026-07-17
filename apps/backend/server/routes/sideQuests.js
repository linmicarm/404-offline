import express from "express";
import {
  getAllSideQuests,
  getSideQuestById,
  createSideQuest,
  updateSideQuest,
  deleteSideQuest,
  updateGoingCount,
  toggleFeatured,
} from "../controllers/sideQuestController.js";

const router = express.Router();

router.get("/", getAllSideQuests);
router.get("/:id", getSideQuestById);
router.post("/", createSideQuest);
router.put("/:id", updateSideQuest);
router.delete("/:id", deleteSideQuest);
router.patch("/:id/going", updateGoingCount);
router.patch("/:id/feature", toggleFeatured);

export default router;