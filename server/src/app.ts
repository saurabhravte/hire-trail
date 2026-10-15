import cors from "cors";
import express from "express";
import { env } from "./common/config/env.js";
import { errorHandler } from "./common/middleware/error.middleware.js";
import { ApiError } from "./common/utils/ApiError.js";

const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", env: env.NODE_ENV });
});

// Later: app.use("/api/auth", authRoute);

// 404 for undefined routes
app.use((req, _res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
});

app.use(errorHandler);

export default app;