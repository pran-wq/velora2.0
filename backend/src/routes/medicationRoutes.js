import { Router } from "express";
import {
  addMedication,
  getMedications,
  updateMedication,
  deleteMedication,
  markAsTaken,
} from "../controllers/medicationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", addMedication);
router.get("/", getMedications);
router.put("/:id", updateMedication);
router.delete("/:id", deleteMedication);
router.patch("/:id/taken", markAsTaken);

export default router;
