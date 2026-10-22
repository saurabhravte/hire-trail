import { Router } from "express";
import { validate } from "../../common/middleware/validate.middleware.js";
import * as controller from "./analytics.controller.js";
import { activityQuery, analyticsRangeQuery } from "./dto/analytics.dto.js";

export const analyticsRouter = Router();

analyticsRouter.get("/overview", validate({ query: analyticsRangeQuery }), controller.overview);
analyticsRouter.get(
  "/conversion",
  validate({ query: analyticsRangeQuery }),
  controller.conversion,
);
analyticsRouter.get(
  "/breakdowns",
  validate({ query: analyticsRangeQuery }),
  controller.breakdowns,
);
analyticsRouter.get("/activity", validate({ query: activityQuery }), controller.activity);
analyticsRouter.get("/streak", controller.streak);
