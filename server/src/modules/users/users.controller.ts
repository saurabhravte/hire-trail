import type { Request, Response } from "express";
import { asyncHandler, sendOk } from "../../common/utils/apiResponse.js";
import type { UpdatePreferencesBody, UpdateProfileBody } from "./dto/users.dto.js";
import * as service from "./users.service.js";

export const me = asyncHandler(async (req: Request, res: Response) => {
  return sendOk(res, await service.getProfile(req.userId!));
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const updated = await service.updateProfile(req.userId!, req.body as UpdateProfileBody);
  return sendOk(res, updated, "Profile updated");
});

export const updatePrefs = asyncHandler(async (req: Request, res: Response) => {
  const updated = await service.updatePreferences(
    req.userId!,
    req.body as UpdatePreferencesBody,
  );
  return sendOk(res, updated, "Preferences updated");
});

export const exportData = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.exportUserData(req.userId!);
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", 'attachment; filename="my-data-export.json"');
  return res.status(200).send(JSON.stringify(data, null, 2));
});

export const deleteMe = asyncHandler(async (req: Request, res: Response) => {
  await service.deleteAccount(req.userId!);
  return sendOk(res, { deleted: true }, "Account deleted");
});