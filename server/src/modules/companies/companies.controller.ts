import type { Request, Response } from "express";
import { asyncHandler, sendOk, sendPaginated } from "../../common/utils/apiResponse.js";
import type { IdParam } from "../../common/dto/baseDto.js";
import type {
  CreateCompanyBody,
  ListCompaniesQuery,
  UpdateCompanyBody,
} from "./dto/companies.dto.js";
import * as service from "./companies.service.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { data, meta } = await service.listCompanies(
    req.userId!,
    req.validatedQuery as ListCompaniesQuery,
  );
  return sendPaginated(res, data, meta);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  return sendOk(res, await service.getCompanyById(req.userId!, id));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const company = await service.createCompany(req.userId!, req.body as CreateCompanyBody);
  return sendOk(res, company, "Company created", 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  const company = await service.updateCompany(req.userId!, id, req.body as UpdateCompanyBody);
  return sendOk(res, company, "Company updated");
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  await service.deleteCompany(req.userId!, id);
  return sendOk(res, { id }, "Company deleted");
});