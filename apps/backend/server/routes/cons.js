import express from "express";
import {
  getAllCons,
  getConById,
  createCon,
  updateCon,
  deleteCon,
} from "../controllers/conController.js";

const router = express.Router();

router.get("/", getAllCons);
router.get("/:id", getConById);
router.post("/", createCon);
router.put("/:id", updateCon);
router.delete("/:id", deleteCon);

export default router;