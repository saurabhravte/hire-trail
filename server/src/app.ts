import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import { sql } from "drizzle-orm";
import express, { type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./common/config/env.js";
import { db } from "./common/db/index.js";
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

// Lightweight keep-alive health check: no auth, rate-limited, trivial DB query.
const healthLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

async function health(_req: Request, res: Response) {
  const time = new Date().toISOString();
  try {
    await db.execute(sql`select 1`);
    res.status(200).json({ status: "ok", time });
  } catch {
    res.status(503).json({ status: "error", time });
  }
}

app.get("/health", healthLimiter, health);
app.get("/api/health", healthLimiter, health);

// Rate limit the API surface.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use("/api/v1", apiLimiter, v1Router);

app.use((req, _res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
});

app.use(errorHandler);

export default app;