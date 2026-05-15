import jwt from "jsonwebtoken";
import { readJSON } from "../utils/storage.js";
import { ApiError } from "../utils/response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authMiddleware = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer "))
    throw new ApiError("Missing or invalid Authorization header", 401);

  const token = header.slice(7).trim();
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new ApiError("JWT_SECRET not configured", 500);

  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch (err) {
    if (err.name === "TokenExpiredError")
      throw new ApiError("Token expired", 401);
    throw new ApiError("Invalid token", 401);
  }

  const users = await readJSON("users", []);
  const user = users.find((u) => u.id === payload.sub);
  if (!user) throw new ApiError("User no longer exists", 401);

  const { password, ...safe } = user;
  req.user = safe;
  next();
});

export default authMiddleware;
