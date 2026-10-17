import type { RequestHandler } from "express";
import { z, ZodError, type ZodType } from "zod";
import { ApiError } from "../utils/ApiError.js";

interface Schemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

export const validate =
  (schemas: Schemas): RequestHandler =>
    (req, _res, next) => {
      try {
        if (schemas.body) req.body = schemas.body.parse(req.body ?? {});
        // req.query / req.params are read-only getters in Express 5 → stash separately.
        if (schemas.query) req.validatedQuery = schemas.query.parse(req.query ?? {});
        if (schemas.params) req.validatedParams = schemas.params.parse(req.params ?? {});
        next();
      } catch (err) {
        if (err instanceof ZodError) {
          return next(ApiError.badRequest(z.prettifyError(err)));
        }
        next(err);
      }
    };