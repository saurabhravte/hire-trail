import { Router } from "express";
import { validate } from "../../common/middleware/validate.middleware.js";
import * as controller from "./users.controller.js";
import { updatePreferencesBody, updateProfileBody } from "./dto/users.dto.js";

export const usersRouter = Router();

usersRouter.get("/", controller.me);
usersRouter.patch("/", validate({ body: updateProfileBody }), controller.updateMe);
usersRouter.patch(
  "/preferences",
  validate({ body: updatePreferencesBody }),
  controller.updatePrefs,
);
usersRouter.get("/export", controller.exportData);
usersRouter.delete("/", controller.deleteMe);