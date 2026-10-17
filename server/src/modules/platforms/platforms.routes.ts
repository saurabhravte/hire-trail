import { Router } from "express";
import { idParam } from "../../common/dto/baseDto.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import * as controller from "./platforms.controller.js";
import { createPlatformBody, updatePlatformBody } from "./dto/platforms.dto.js";

export const platformsRouter = Router();

platformsRouter.get("/", controller.list);
platformsRouter.post("/", validate({ body: createPlatformBody }), controller.create);
platformsRouter.patch(
  "/:id",
  validate({ params: idParam, body: updatePlatformBody }),
  controller.update,
);
platformsRouter.delete("/:id", validate({ params: idParam }), controller.remove);