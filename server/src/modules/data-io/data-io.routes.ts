import { Router, type RequestHandler } from "express";
import multer from "multer";
import { validate } from "../../common/middleware/validate.middleware.js";
import { ApiError } from "../../common/utils/ApiError.js";
import * as controller from "./data-io.controller.js";
import { commitImportBody } from "./dto/data-io.dto.js";

const MAX_CSV_BYTES = 5 * 1024 * 1024;

const csvHandler = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_CSV_BYTES },
  fileFilter: (_req, file, cb) => {
    const ok =
      file.mimetype === "text/csv" ||
      file.mimetype === "application/vnd.ms-excel" ||
      file.originalname.toLowerCase().endsWith(".csv");
    if (!ok) {
      cb(new Error("Only CSV files are allowed"));
      return;
    }
    cb(null, true);
  },
}).single("file");

const uploadCsv: RequestHandler = (req, res, next) => {
  csvHandler(req, res, (err: unknown) => {
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

// /api/v1/import/applications/*
export const importRouter = Router();
importRouter.post("/applications/preview", uploadCsv, controller.previewImport);
importRouter.post(
  "/applications/commit",
  validate({ body: commitImportBody }),
  controller.commitImport,
);

// /api/v1/export/applications
export const exportRouter = Router();
exportRouter.get("/applications", controller.exportApplications);