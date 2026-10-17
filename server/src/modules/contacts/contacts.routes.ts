import { Router } from "express";
import { idParam } from "../../common/dto/baseDto.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import * as controller from "./contacts.controller.js";
import {
  createContactBody,
  listContactsQuery,
  updateContactBody,
} from "./dto/contacts.dto.js";

export const contactsRouter = Router();

contactsRouter.get("/", validate({ query: listContactsQuery }), controller.list);
contactsRouter.post("/", validate({ body: createContactBody }), controller.create);
contactsRouter.get("/:id", validate({ params: idParam }), controller.getOne);
contactsRouter.patch(
  "/:id",
  validate({ params: idParam, body: updateContactBody }),
  controller.update,
);
contactsRouter.delete("/:id", validate({ params: idParam }), controller.remove);