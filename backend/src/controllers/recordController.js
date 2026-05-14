import { promises as fs } from "fs";
import path from "path";

import { readJSON, appendItem, removeItem } from "../utils/storage.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success, created, ApiError } from "../utils/response.js";
import { logger } from "../utils/logger.js";
import { generateId, formatDate } from "../utils/helpers.js";
import { UPLOAD_DIR } from "../middleware/uploadMiddleware.js";

const RECORDS = "records";

// strip path separators / null bytes; keep readable filename for UI
const sanitizeName = (name) =>
  String(name || "file")
    .replace(/[\\/\x00]/g, "_")
    .slice(0, 200);

// POST /api/records/upload  (multipart, field: "file")
export const uploadRecord = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError("No file uploaded (field: 'file')", 400);

  const record = {
    id: generateId(),
    userId: req.user.id,
    originalName: sanitizeName(req.file.originalname),
    fileName: req.file.filename,
    filePath: path.join("uploads", req.file.filename), // relative path
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedAt: formatDate(),
  };

  await appendItem(RECORDS, record);
  return created(res, { record }, "Record uploaded");
});

// GET /api/records
export const getRecords = asyncHandler(async (req, res) => {
  const all = await readJSON(RECORDS, []);
  const mine = all
    .filter((r) => r.userId === req.user.id)
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  return success(res, { records: mine }, "Records fetched");
});

// DELETE /api/records/:id
export const deleteRecord = asyncHandler(async (req, res) => {
  const all = await readJSON(RECORDS, []);
  const record = all.find((r) => r.id === req.params.id);
  if (!record || record.userId !== req.user.id)
    throw new ApiError("Record not found", 404);

  // delete physical file (best-effort)
  try {
    await fs.unlink(path.join(UPLOAD_DIR, record.fileName));
  } catch (err) {
    if (err.code !== "ENOENT") logger.warn("Failed to delete file:", err.message);
  }

  await removeItem(RECORDS, (r) => r.id === req.params.id && r.userId === req.user.id);
  return success(res, { id: req.params.id }, "Record deleted");
});
