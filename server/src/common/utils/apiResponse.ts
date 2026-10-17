import type { NextFunction, Request, RequestHandler, Response } from "express";

export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** 200/201 success payload: { success, message, data, meta? } */
export function sendOk<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  meta: PageMeta,
  message = "Success",
) {
  return res.status(200).json({ success: true, message, data, meta });
}

export function buildPageMeta(total: number, page: number, pageSize: number): PageMeta {
  return { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

/** Wrap async controllers so thrown/rejected errors reach the error middleware. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
    (req, res, next) =>
      Promise.resolve(fn(req, res, next)).catch(next);