import { Router } from "express";
import {
  dashboard,
  recoveryTrends,
  adherence,
  mood,
} from "../controllers/analyticsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/dashboard", dashboard);
router.get("/recovery-trends", recoveryTrends);
router.get("/adherence", adherence);
router.get("/mood", mood);

export default router;
