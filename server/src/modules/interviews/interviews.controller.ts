import type { Request, Response } from "express";
import type { IdParam } from "../../common/dto/baseDto.js";
import { asyncHandler, sendOk } from "../../common/utils/apiResponse.js";
import type {
  CreateInterviewBody,
  ListInterviewsQuery,
  UpdateInterviewBody,
} from "./dto/interviews.dto.js";
import * as service from "./interviews.service.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.listInterviews(
    req.userId!,
    req.validatedQuery as ListInterviewsQuery,
  );
  return sendOk(res, data);
});

/** Nested under /applications/:applicationId/interviews */
export const listForApplication = asyncHandler(async (req: Request, res: Response) => {
  const { applicationId } = req.params as { applicationId: string };
  const data = await service.listInterviews(req.userId!, { applicationId } as ListInterviewsQuery);
  return sendOk(res, data);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { applicationId } = req.params as { applicationId: string };
  const created = await service.createInterview(
    req.userId!,
    applicationId,
    req.body as CreateInterviewBody,
  );
  return sendOk(res, created, "Interview scheduled", 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  const updated = await service.updateInterview(
    req.userId!,
    id,
    req.body as UpdateInterviewBody,
  );
  return sendOk(res, updated, "Interview updated");
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  await service.deleteInterview(req.userId!, id);
  return sendOk(res, { id }, "Interview deleted");
});