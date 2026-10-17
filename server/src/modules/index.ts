import { Router } from "express";
import { requireAuth } from "../common/middleware/auth.middleware.js";
import { analyticsRouter } from "./analytics/analytics.routes.js";
import { applicationsRouter } from "./applications/applications.routes.js";
import { companiesRouter } from "./companies/companies.routes.js";
import { exportRouter, importRouter } from "./data-io/data-io.routes.js";
import { goalsRouter } from "./goals/goals.routes.js";
import {
  applicationInterviewsRouter,
  interviewsRouter,
} from "./interviews/interviews.routes.js";
import { notificationsRouter } from "./notifications/notifications.routes.js";
import { offersRouter } from "./offers/offers.routes.js";
import { platformsRouter } from "./platforms/platforms.routes.js";
import { resumesRouter } from "./resumes/resumes.routes.js";
import { tasksRouter } from "./tasks/tasks.routes.js";
import { usersRouter } from "./users/users.routes.js";

import { contactsRouter } from "./contacts/contacts.routes.js";

export const v1Router = Router();

// Everything under /api/v1 requires a verified Clerk session.
v1Router.use(requireAuth);

// Nested interview routes must be registered before the applications router.
v1Router.use("/applications/:applicationId/interviews", applicationInterviewsRouter);

v1Router.use("/me", usersRouter);
v1Router.use("/companies", companiesRouter);
v1Router.use("/applications", applicationsRouter);
v1Router.use("/platforms", platformsRouter);
v1Router.use("/resumes", resumesRouter);
v1Router.use("/interviews", interviewsRouter);
v1Router.use("/tasks", tasksRouter);
v1Router.use("/notifications", notificationsRouter);
v1Router.use("/analytics", analyticsRouter);
v1Router.use("/offers", offersRouter);
v1Router.use("/goals", goalsRouter);
v1Router.use("/import", importRouter);
v1Router.use("/export", exportRouter);

v1Router.use("/contacts", contactsRouter); s