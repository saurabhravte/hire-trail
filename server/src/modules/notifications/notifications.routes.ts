import { Router } from "express";
import { idParam } from "../../common/dto/baseDto.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import * as controller from "./notifications.controller.js";
import {
  listNotificationsQuery,
  updateNotificationBody,
} from "./dto/notifications.dto.js";

export const notificationsRouter = Router();

notificationsRouter.get("/", validate({ query: listNotificationsQuery }), controller.list);
notificationsRouter.patch(
  "/:id",
  validate({ params: idParam, body: updateNotificationBody }),
  controller.update,
);