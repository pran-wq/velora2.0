import { Router } from "express";
import {
  uploadRecord,
  getRecords,
  deleteRecord,
} from "../controllers/recordController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { singleFile } from "../middleware/uploadMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/upload", singleFile("file"), uploadRecord);
router.get("/", getRecords);
router.delete("/:id", deleteRecord);

export default router;
