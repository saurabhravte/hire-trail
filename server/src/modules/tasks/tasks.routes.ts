import { Router } from "express";
import { idParam } from "../../common/dto/baseDto.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import * as controller from "./tasks.controller.js";
import { createTaskBody, listTasksQuery, updateTaskBody } from "./dto/tasks.dto.js";

export const tasksRouter = Router();

tasksRouter.get("/", validate({ query: listTasksQuery }), controller.list);
tasksRouter.post("/", validate({ body: createTaskBody }), controller.create);
tasksRouter.patch(
  "/:id",
  validate({ params: idParam, body: updateTaskBody }),
  controller.update,
);
tasksRouter.post("/:id/complete", validate({ params: idParam }), controller.complete);
tasksRouter.delete("/:id", validate({ params: idParam }), controller.remove);