import type { Request, Response } from "express";
import { ApiError } from "../../common/utils/ApiError.js";
import { asyncHandler, sendOk } from "../../common/utils/apiResponse.js";
import type { CommitImportBody } from "./dto/data-io.dto.js";
import * as service from "./data-io.service.js";

export const exportApplications = asyncHandler(async (req: Request, res: Response) => {
  const csv = await service.exportApplicationsCsv(req.userId!);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="applications.csv"');
  return res.status(200).send(csv);
});

export const previewImport = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest("CSV file is required (field name: file)");
  const csvText = req.file.buffer.toString("utf-8");
  const result = await service.previewImport(req.userId!, csvText);
  return sendOk(res, result, "Import preview ready");
});

export const commitImport = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.commitImport(req.userId!, req.body as CommitImportBody);
  return sendOk(res, result, "Import committed", 201);
});