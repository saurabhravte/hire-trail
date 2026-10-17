import { Router } from "express";
import { requireAuth } from "../common/middleware/auth.middleware.js";
import { applicationsRouter } from "./applications/applications.routes.js";
import { companiesRouter } from "./companies/companies.routes.js";

export const v1Router = Router();

// Everything under /api/v1 requires a verified Clerk session.
v1Router.use(requireAuth);

v1Router.use("/companies", companiesRouter);
v1Router.use("/applications", applicationsRouter);

// Part 2: /platforms, /resumes, /interviews, /tasks, /notifications
// Part 3: /analytics, /offers, /import, /export, /goals, /me