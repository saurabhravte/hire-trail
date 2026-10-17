import { Router } from "express";
import { idParam } from "../../common/dto/baseDto.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import * as controller from "./offers.controller.js";
import { compareQuery, createOfferBody, updateOfferBody } from "./dto/offers.dto.js";

export const offersRouter = Router();

offersRouter.get("/", controller.list);
offersRouter.get("/compare", validate({ query: compareQuery }), controller.compare);
offersRouter.post("/", validate({ body: createOfferBody }), controller.create);
offersRouter.patch(
  "/:id",
  validate({ params: idParam, body: updateOfferBody }),
  controller.update,
);
offersRouter.delete("/:id", validate({ params: idParam }), controller.remove);