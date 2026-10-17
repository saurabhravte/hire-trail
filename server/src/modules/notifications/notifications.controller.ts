import type { Request, Response } from "express";
import type { IdParam } from "../../common/dto/baseDto.js";
import { asyncHandler, sendOk, sendPaginated } from "../../common/utils/apiResponse.js";
import type {
  ListNotificationsQuery,
  UpdateNotificationBody,
} from "./dto/notifications.dto.js";
import * as service from "./notifications.service.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { data, meta } = await service.listNotifications(
    req.userId!,
    req.validatedQuery as ListNotificationsQuery,
  );
  return sendPaginated(res, data, meta);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  const updated = await service.updateNotificationState(
    req.userId!,
    id,
    req.body as UpdateNotificationBody,
  );
  return sendOk(res, updated, "Notification updated");
});