import { Router } from "express";
import { validate } from "../../common/middleware/validate.middleware.js";
import * as controller from "./goals.controller.js";
import { upsertGoalBody } from "./dto/goals.dto.js";

export const goalsRouter = Router();

goalsRouter.get("/current", controller.current);
goalsRouter.put("/current", validate({ body: upsertGoalBody }), controller.upsert);