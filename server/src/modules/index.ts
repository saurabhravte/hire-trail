import { Router } from "express";
import { requireAuth } from "../common/middleware/auth.middleware.js";
import { applicationsRouter } from "./applications/applications.routes.js";
import { companiesRouter } from "./companies/companies.routes.js";
import {
  applicationInterviewsRouter,
  interviewsRouter,
} from "./interviews/interviews.routes.js";
import { notificationsRouter } from "./notifications/notifications.routes.js";
import { platformsRouter } from "./platforms/platforms.routes.js";
import { resumesRouter } from "./resumes/resumes.routes.js";
import { tasksRouter } from "./tasks/tasks.routes.js";

export const v1Router = Router();

// Everything under /api/v1 requires a verified Clerk session.
v1Router.use(requireAuth);

// Nested interview routes must be registered before the applications router.
v1Router.use("/applications/:applicationId/interviews", applicationInterviewsRouter);

v1Router.use("/companies", companiesRouter);
v1Router.use("/applications", applicationsRouter);
v1Router.use("/platforms", platformsRouter);
v1Router.use("/resumes", resumesRouter);
v1Router.use("/interviews", interviewsRouter);
v1Router.use("/tasks", tasksRouter);
v1Router.use("/notifications", notificationsRouter);

// Part 3: /analytics, /offers, /import, /export, /goals, /me