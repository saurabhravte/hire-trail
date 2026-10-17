import { Router } from "express";
import { idParam } from "../../common/dto/baseDto.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import * as controller from "./companies.controller.js";
import {
  createCompanyBody,
  listCompaniesQuery,
  updateCompanyBody,
} from "./dto/companies.dto.js";

export const companiesRouter = Router();

companiesRouter.get("/", validate({ query: listCompaniesQuery }), controller.list);
companiesRouter.post("/", validate({ body: createCompanyBody }), controller.create);
companiesRouter.get("/:id", validate({ params: idParam }), controller.getOne);
companiesRouter.patch(
  "/:id",
  validate({ params: idParam, body: updateCompanyBody }),
  controller.update,
);
companiesRouter.delete("/:id", validate({ params: idParam }), controller.remove);