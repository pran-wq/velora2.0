import { Router } from "express";
import {
  wellnessSummary,
  recoveryInsight,
  motivation,
} from "../controllers/aiController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/wellness-summary", wellnessSummary);
router.post("/recovery-insight", recoveryInsight);
router.post("/motivation", motivation);

export default router;
