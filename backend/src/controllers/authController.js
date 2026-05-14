import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { readJSON, appendItem } from "../utils/storage.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success, created, ApiError } from "../utils/response.js";
import { generateId, sanitizeUser, formatDate } from "../utils/helpers.js";
import { AUTH, EMAIL_REGEX, MESSAGES } from "../utils/constants.js";

const USERS = "users";

const signToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new ApiError(MESSAGES.jwtMissing, 500);
  return jwt.sign(
    { sub: user.id, email: user.email },
    secret,
    { expiresIn: AUTH.tokenTtl }
  );
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, age, gender, bloodGroup } = req.body || {};

  if (!name || !email || !password)
    throw new ApiError("name, email and password are required", 400);
  if (!EMAIL_REGEX.test(email))
    throw new ApiError("Invalid email format", 400);
  if (password.length < AUTH.minPasswordLength)
    throw new ApiError(
      `Password must be at least ${AUTH.minPasswordLength} characters`,
      400
    );

  const normalizedEmail = String(email).toLowerCase().trim();
  const users = await readJSON(USERS, []);
  if (users.some((u) => u.email === normalizedEmail))
    throw new ApiError("Email already registered", 409);

  const hashed = await bcrypt.hash(password, AUTH.saltRounds);

  const user = {
    id: generateId(),
    name: String(name).trim(),
    email: normalizedEmail,
    password: hashed,
    age: age ?? null,
    gender: gender ?? null,
    bloodGroup: bloodGroup ?? null,
    createdAt: formatDate(),
  };

  await appendItem(USERS, user);
  const token = signToken(user);

  return created(res, { token, user: sanitizeUser(user) }, "Registered");
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password)
    throw new ApiError("email and password are required", 400);

  const normalizedEmail = String(email).toLowerCase().trim();
  const users = await readJSON(USERS, []);
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) throw new ApiError(MESSAGES.invalidCredentials, 401);

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new ApiError(MESSAGES.invalidCredentials, 401);

  const token = signToken(user);
  return success(res, { token, user: sanitizeUser(user) }, "Logged in");
});

export const me = asyncHandler(async (req, res) => {
  return success(res, { user: req.user }, "Current user");
});
