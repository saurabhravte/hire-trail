import type { Request, Response } from "express";
import type { IdParam } from "../../common/dto/baseDto.js";
import { asyncHandler, sendOk } from "../../common/utils/apiResponse.js";
import type { CompareQuery, CreateOfferBody, UpdateOfferBody } from "./dto/offers.dto.js";
import * as service from "./offers.service.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  return sendOk(res, await service.listOffers(req.userId!));
});

export const compare = asyncHandler(async (req: Request, res: Response) => {
  return sendOk(res, await service.compareOffers(req.userId!, req.validatedQuery as CompareQuery));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const created = await service.createOffer(req.userId!, req.body as CreateOfferBody);
  return sendOk(res, created, "Offer created", 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  const updated = await service.updateOffer(req.userId!, id, req.body as UpdateOfferBody);
  return sendOk(res, updated, "Offer updated");
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as IdParam;
  await service.deleteOffer(req.userId!, id);
  return sendOk(res, { id }, "Offer deleted");
});