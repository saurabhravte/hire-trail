import { Router } from "express";
import { idParam } from "../../common/dto/baseDto.js";
import { uploadResumeFile } from "../../common/middleware/upload.middleware.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import * as controller from "./resumes.controller.js";
import { createResumeBody, updateResumeBody } from "./dto/resumes.dto.js";

export const resumesRouter = Router();

resumesRouter.get("/", controller.list);
resumesRouter.post("/", uploadResumeFile, validate({ body: createResumeBody }), controller.create);
resumesRouter.get("/:id", validate({ params: idParam }), controller.getOne);
resumesRouter.get("/:id/signed-url", validate({ params: idParam }), controller.signedUrl);
resumesRouter.patch(
  "/:id",
  uploadResumeFile,
  validate({ params: idParam, body: updateResumeBody }),
  controller.update,
);
resumesRouter.post("/:id/default", validate({ params: idParam }), controller.makeDefault);
resumesRouter.delete("/:id", validate({ params: idParam }), controller.remove);