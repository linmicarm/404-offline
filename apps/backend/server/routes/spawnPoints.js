import express from "express";
import {
  getAllSpawnPoints,
  getSpawnPointById,
  createSpawnPoint,
  updateSpawnPoint,
  deleteSpawnPoint,
} from "../controllers/spawnPointController.js";

const router = express.Router();

router.get("/", getAllSpawnPoints);
router.get("/:id", getSpawnPointById);
router.post("/", createSpawnPoint);
router.put("/:id", updateSpawnPoint);
router.delete("/:id", deleteSpawnPoint);

export default router;