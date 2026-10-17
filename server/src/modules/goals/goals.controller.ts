import type { Request, Response } from "express";
import { asyncHandler, sendOk } from "../../common/utils/apiResponse.js";
import type { UpsertGoalBody } from "./dto/goals.dto.js";
import * as service from "./goals.service.js";

export const current = asyncHandler(async (req: Request, res: Response) => {
  return sendOk(res, await service.getCurrentWeekProgress(req.userId!));
});

export const upsert = asyncHandler(async (req: Request, res: Response) => {
  const goal = await service.upsertCurrentWeekGoal(req.userId!, req.body as UpsertGoalBody);
  return sendOk(res, goal, "Weekly goal saved");
});