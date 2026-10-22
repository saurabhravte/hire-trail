import type { Request } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

/**
 * Shared rate-limiter factory. Falls back to the socket address when req.ip is
 * undefined (destroyed sockets / odd proxies) so one bad request can't crash the process.
 */
export function createLimiter(opts: { windowMs: number; limit: number }) {
  return rateLimit({
    ...opts,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    keyGenerator: (req: Request) =>
      ipKeyGenerator(req.ip ?? req.socket?.remoteAddress ?? "unknown"),
    validate: { ip: false },
  });
}