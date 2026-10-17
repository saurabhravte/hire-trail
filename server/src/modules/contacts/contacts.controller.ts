import type { Request, Response } from "express";
import type { IdParam } from "../../common/dto/baseDto.js";
import { asyncHandler, sendOk, sendPaginated } from "../../common/utils/apiResponse.js";
import type {
  CreateContactBody,
  ListContactsQuery,
  UpdateContactBody,
} from "./dto/contacts.dto.js";
import * as service from "./contacts.service.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { data, meta } = await service.listContacts(
    req.userId!,
    req.validatedQuery as ListContactsQuery,
  );
  return sendPaginated(res, data, meta);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  return sendOk(res, await service.getContactById(req.userId!, id));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const created = await service.createContact(req.userId!, req.body as CreateContactBody);
  return sendOk(res, created, "Contact created", 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  const updated = await service.updateContact(req.userId!, id, req.body as UpdateContactBody);
  return sendOk(res, updated, "Contact updated");
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  await service.deleteContact(req.userId!, id);
  return sendOk(res, { id }, "Contact deleted");
});