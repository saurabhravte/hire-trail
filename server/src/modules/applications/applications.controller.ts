import type { Request, Response } from "express";
import type { IdParam } from "../../common/dto/baseDto.js";
import { asyncHandler, sendOk, sendPaginated } from "../../common/utils/apiResponse.js";
import * as service from "./applications.service.js";
import type {
  BulkActionBody,
  CreateApplicationBody,
  DuplicateCheckQuery,
  ListApplicationsQuery,
  StatusChangeBody,
  UpdateApplicationBody,
} from "./dto/applications.dto.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { data, meta } = await service.listApplications(
    req.userId!,
    req.validatedQuery as ListApplicationsQuery,
  );
  return sendPaginated(res, data, meta);
});

export const grouped = asyncHandler(async (req: Request, res: Response) => {
  const includeArchived =
    (req.validatedQuery as { archived?: string } | undefined)?.archived === "all";
  return sendOk(res, await service.listGroupedByCompany(req.userId!, includeArchived));
});

export const duplicates = asyncHandler(async (req: Request, res: Response) => {
  const found = await service.findDuplicates(
    req.userId!,
    req.validatedQuery as DuplicateCheckQuery,
  );
  return sendOk(res, found);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  return sendOk(res, await service.getApplicationById(req.userId!, id));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const created = await service.createApplication(req.userId!, req.body as CreateApplicationBody);
  return sendOk(res, created, "Application created", 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  const updated = await service.updateApplication(
    req.userId!,
    id,
    req.body as UpdateApplicationBody,
  );
  return sendOk(res, updated, "Application updated");
});

export const changeStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  const updated = await service.changeStatus(req.userId!, id, req.body as StatusChangeBody);
  return sendOk(res, updated, "Status updated");
});

export const archive = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  return sendOk(res, await service.setArchived(req.userId!, id, true), "Application archived");
});

export const restore = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  return sendOk(res, await service.setArchived(req.userId!, id, false), "Application restored");
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  await service.deleteApplication(req.userId!, id);
  return sendOk(res, { id }, "Application deleted");
});

export const bulk = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.bulkAction(req.userId!, req.body as BulkActionBody);
  return sendOk(res, result, "Bulk action completed");
});

export const history = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  return sendOk(res, await service.getStatusHistory(req.userId!, id));
});

export const activity = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  return sendOk(res, await service.getActivity(req.userId!, id));
});