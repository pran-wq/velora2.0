import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// Ensure uploads dir exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
]);

const ALLOWED_EXT = new Set([".pdf", ".jpg", ".jpeg", ".png"]);

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
    cb(null, unique);
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.has(ext)) {
    const err = new Error("Unsupported file type. Allowed: pdf, jpg, jpeg, png");
    err.status = 400;
    return cb(err, false);
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_BYTES, files: 1 },
});

// Wrap multer single() to convert its errors to our ApiError shape.
export const singleFile = (field = "file") => (req, res, next) => {
  upload.single(field)(req, res, (err) => {
    if (!err) return next();
    if (err.code === "LIMIT_FILE_SIZE")
      return next(Object.assign(new Error("File too large (max 5MB)"), { status: 400 }));
    err.status = err.status || 400;
    next(err);
  });
};
