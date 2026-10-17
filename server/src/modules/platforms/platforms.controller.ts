import type { Request, Response } from "express";
import type { IdParam } from "../../common/dto/baseDto.js";
import { asyncHandler, sendOk } from "../../common/utils/apiResponse.js";
import type { CreatePlatformBody, UpdatePlatformBody } from "./dto/platforms.dto.js";
import * as service from "./platforms.service.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  return sendOk(res, await service.listPlatforms(req.userId!));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const created = await service.createPlatform(req.userId!, req.body as CreatePlatformBody);
  return sendOk(res, created, "Platform created", 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  const updated = await service.updatePlatform(req.userId!, id, req.body as UpdatePlatformBody);
  return sendOk(res, updated, "Platform updated");
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  await service.deletePlatform(req.userId!, id);
  return sendOk(res, { id }, "Platform deleted");
});