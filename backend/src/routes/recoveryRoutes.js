import { Router } from "express";
import {
  addRecovery,
  getRecovery,
  updateRecovery,
  deleteRecovery,
} from "../controllers/recoveryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", addRecovery);
router.get("/", getRecovery);
router.put("/:id", updateRecovery);
router.delete("/:id", deleteRecovery);

export default router;
