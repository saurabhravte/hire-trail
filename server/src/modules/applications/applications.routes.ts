import { Router } from "express";
import { idParam } from "../../common/dto/baseDto.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import * as controller from "./applications.controller.js";
import {
  bulkActionBody,
  createApplicationBody,
  duplicateCheckQuery,
  listApplicationsQuery,
  statusChangeBody,
  updateApplicationBody,
} from "./dto/applications.dto.js";

export const applicationsRouter = Router();

applicationsRouter.get("/", validate({ query: listApplicationsQuery }), controller.list);
applicationsRouter.get("/grouped", validate({ query: listApplicationsQuery }), controller.grouped);
applicationsRouter.get(
  "/duplicates",
  validate({ query: duplicateCheckQuery }),
  controller.duplicates,
);
applicationsRouter.post("/", validate({ body: createApplicationBody }), controller.create);
applicationsRouter.post("/bulk", validate({ body: bulkActionBody }), controller.bulk);

applicationsRouter.get("/:id", validate({ params: idParam }), controller.getOne);
applicationsRouter.patch(
  "/:id",
  validate({ params: idParam, body: updateApplicationBody }),
  controller.update,
);
applicationsRouter.delete("/:id", validate({ params: idParam }), controller.remove);

applicationsRouter.patch(
  "/:id/status",
  validate({ params: idParam, body: statusChangeBody }),
  controller.changeStatus,
);
applicationsRouter.post("/:id/archive", validate({ params: idParam }), controller.archive);
applicationsRouter.post("/:id/restore", validate({ params: idParam }), controller.restore);
applicationsRouter.get("/:id/history", validate({ params: idParam }), controller.history);
applicationsRouter.get("/:id/activity", validate({ params: idParam }), controller.activity);