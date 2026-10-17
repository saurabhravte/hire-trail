// Request augmentations. Express 5 makes req.query a getter with no setter,
// so validated query/params are stashed on dedicated fields instead.
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      requestId?: string;
      validatedQuery?: unknown;
      validatedParams?: unknown;
    }
  }
}

export { };