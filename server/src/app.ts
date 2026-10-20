import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./common/config/env.js";
import { errorHandler } from "./common/middleware/error.middleware.js";
import { requestId } from "./common/middleware/requestId.middleware.js";
import { ApiError } from "./common/utils/ApiError.js";
import { v1Router } from "./modules/index.js";

const app = express();
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestId);
app.use(clerkMiddleware({ authorizedParties: [env.CLIENT_URL] }));

// Public health checks
app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: env.NODE_ENV });
});
// Kept for backwards compatibility with the existing setup.
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", env: env.NODE_ENV });
});

// Rate limit the API surface (PRD §24).
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use("/api/v1", apiLimiter, v1Router);

// 404 for undefined routes
app.use((req, _res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
});

app.use(errorHandler);

export default app;