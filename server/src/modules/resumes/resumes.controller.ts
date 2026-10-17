import type { Request, Response } from "express";
import type { IdParam } from "../../common/dto/baseDto.js";
import { asyncHandler, sendOk } from "../../common/utils/apiResponse.js";
import type { CreateResumeBody, UpdateResumeBody } from "./dto/resumes.dto.js";
import * as service from "./resumes.service.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  return sendOk(res, await service.listResumes(req.userId!));
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  return sendOk(res, await service.getResumeById(req.userId!, id));
});

export const signedUrl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  return sendOk(res, await service.getSignedDownloadUrl(req.userId!, id));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const created = await service.createResume(
    req.userId!,
    req.body as CreateResumeBody,
    req.file,
  );
  return sendOk(res, created, "Resume created", 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  const updated = await service.updateResume(
    req.userId!,
    id,
    req.body as UpdateResumeBody,
    req.file,
  );
  return sendOk(res, updated, "Resume updated");
});

export const makeDefault = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  return sendOk(res, await service.setDefault(req.userId!, id), "Default resume set");
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  await service.deleteResume(req.userId!, id);
  return sendOk(res, { id }, "Resume deleted");
});