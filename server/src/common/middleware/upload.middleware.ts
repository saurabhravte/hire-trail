import type { RequestHandler } from "express";
import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

export const ALLOWED_RESUME_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5 MB

const handler = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_RESUME_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_RESUME_MIME.has(file.mimetype)) {
      cb(new Error("Unsupported file type. Allowed: PDF, DOC, DOCX"));
      return;
    }
    cb(null, true);
  },
}).single("file");

/** Optional single-file upload under field name "file". */
export const uploadResumeFile: RequestHandler = (req, res, next) => {
  handler(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      return next(
        ApiError.badRequest(
          err.code === "LIMIT_FILE_SIZE" ? "File exceeds 5 MB limit" : err.message,
        ),
      );
    }
    if (err instanceof Error) return next(ApiError.badRequest(err.message));
    next();
  });
};