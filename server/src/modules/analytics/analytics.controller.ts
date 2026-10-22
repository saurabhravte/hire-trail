import type { Request, Response } from "express";
import { asyncHandler, sendOk } from "../../common/utils/apiResponse.js";
import type { ActivityQuery, AnalyticsRangeQuery } from "./dto/analytics.dto.js";
import * as service from "./analytics.service.js";
import { getStreak } from "./streak.service.js";

export const overview = asyncHandler(async (req: Request, res: Response) => {
  return sendOk(
    res,
    await service.getOverview(req.userId!, req.validatedQuery as AnalyticsRangeQuery),
  );
});

export const conversion = asyncHandler(async (req: Request, res: Response) => {
  return sendOk(
    res,
    await service.getConversion(req.userId!, req.validatedQuery as AnalyticsRangeQuery),
  );
});

export const breakdowns = asyncHandler(async (req: Request, res: Response) => {
  return sendOk(
    res,
    await service.getBreakdowns(req.userId!, req.validatedQuery as AnalyticsRangeQuery),
  );
});

export const activity = asyncHandler(async (req: Request, res: Response) => {
  return sendOk(res, await service.getActivity(req.userId!, req.validatedQuery as ActivityQuery));
});

export const streak = asyncHandler(async (req: Request, res: Response) => {
  return sendOk(res, await getStreak(req.userId!));
});
