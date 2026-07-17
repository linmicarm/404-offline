import express from "express";
import {
  getAllSpawnPoints,
  getSpawnPointById,
  createSpawnPoint,
  updateSpawnPoint,
  deleteSpawnPoint,
  rateSpawnPoint,
  checkinSpawnPoint,
} from "../controllers/spawnPointController.js";

const router = express.Router();

router.get("/", getAllSpawnPoints);
router.get("/:id", getSpawnPointById);
router.post("/", createSpawnPoint);
router.put("/:id", updateSpawnPoint);
router.delete("/:id", deleteSpawnPoint);
router.patch("/:id/rate", rateSpawnPoint);
router.patch("/:id/checkin", checkinSpawnPoint);

export default router;