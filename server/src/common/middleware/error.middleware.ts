import type { ErrorRequestHandler } from "express";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let status = 500;
  let message = "Internal server error";

  if (err instanceof ApiError) {
    status = err.statusCode;
    message = err.message;
  } else if (typeof err?.status === "number" && err.status >= 400 && err.status < 500) {
    status = err.status;
    message = err.message;
  }

  if (status >= 500) {
    logger.error("Unhandled error", {
      requestId: req.requestId,
      path: req.originalUrl,
      error: err instanceof Error ? err.stack : String(err),
    });
    // Never leak internals to the client in production.
    if (process.env.NODE_ENV === "production") message = "Internal server error";
  }
  res.status(status).json({ success: false, message });
};