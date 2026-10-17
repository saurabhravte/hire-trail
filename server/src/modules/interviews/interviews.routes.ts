import { Router } from "express";
import { z } from "zod";
import { idParam } from "../../common/dto/baseDto.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import * as controller from "./interviews.controller.js";
import {
  createInterviewBody,
  listInterviewsQuery,
  updateInterviewBody,
} from "./dto/interviews.dto.js";

// Flat: /api/v1/interviews
export const interviewsRouter = Router();
interviewsRouter.get("/", validate({ query: listInterviewsQuery }), controller.list);
interviewsRouter.patch(
  "/:id",
  validate({ params: idParam, body: updateInterviewBody }),
  controller.update,
);
interviewsRouter.delete("/:id", validate({ params: idParam }), controller.remove);

// Nested: /api/v1/applications/:applicationId/interviews
const applicationIdParam = z.object({ applicationId: z.string().uuid("Invalid application id") });

export const applicationInterviewsRouter = Router({ mergeParams: true });
applicationInterviewsRouter.get(
  "/",
  validate({ params: applicationIdParam }),
  controller.listForApplication,
);
applicationInterviewsRouter.post(
  "/",
  validate({ params: applicationIdParam, body: createInterviewBody }),
  controller.create,
);