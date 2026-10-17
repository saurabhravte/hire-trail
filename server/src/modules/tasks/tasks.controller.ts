import type { Request, Response } from "express";
import type { IdParam } from "../../common/dto/baseDto.js";
import { asyncHandler, sendOk } from "../../common/utils/apiResponse.js";
import type { CreateTaskBody, ListTasksQuery, UpdateTaskBody } from "./dto/tasks.dto.js";
import * as service from "./tasks.service.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  return sendOk(res, await service.listTasks(req.userId!, req.validatedQuery as ListTasksQuery));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const created = await service.createTask(req.userId!, req.body as CreateTaskBody);
  return sendOk(res, created, "Task created", 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  const updated = await service.updateTask(req.userId!, id, req.body as UpdateTaskBody);
  return sendOk(res, updated, "Task updated");
});

export const complete = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  return sendOk(res, await service.completeTask(req.userId!, id), "Task completed");
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  await service.deleteTask(req.userId!, id);
  return sendOk(res, { id }, "Task deleted");
});