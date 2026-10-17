import { getAuth } from "@clerk/express";
import { asyncHandler } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const { userId } = getAuth(req);
  if (!userId) throw ApiError.unauthorized("Authentication required");
  req.userId = userId; // verified Clerk identity; the only trusted owner id
  next();
});