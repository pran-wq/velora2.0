import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { readJSON, appendItem } from "../utils/storage.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success, created, ApiError } from "../utils/response.js";

const USERS = "users";
const SALT_ROUNDS = 10;
const TOKEN_TTL = "7d";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitize = (user) => {
  const { password, ...safe } = user;
  return safe;
};

const signToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new ApiError("JWT_SECRET not configured", 500);
  return jwt.sign(
    { sub: user.id, email: user.email },
    secret,
    { expiresIn: TOKEN_TTL }
  );
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, age, gender, bloodGroup } = req.body || {};

  if (!name || !email || !password)
    throw new ApiError("name, email and password are required", 400);
  if (!emailRe.test(email))
    throw new ApiError("Invalid email format", 400);
  if (password.length < 6)
    throw new ApiError("Password must be at least 6 characters", 400);

  const normalizedEmail = String(email).toLowerCase().trim();
  const users = await readJSON(USERS, []);
  if (users.some((u) => u.email === normalizedEmail))
    throw new ApiError("Email already registered", 409);

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const user = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    email: normalizedEmail,
    password: hashed,
    age: age ?? null,
    gender: gender ?? null,
    bloodGroup: bloodGroup ?? null,
    createdAt: new Date().toISOString(),
  };

  await appendItem(USERS, user);
  const token = signToken(user);

  return created(res, { token, user: sanitize(user) }, "Registered");
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password)
    throw new ApiError("email and password are required", 400);

  const normalizedEmail = String(email).toLowerCase().trim();
  const users = await readJSON(USERS, []);
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) throw new ApiError("Invalid credentials", 401);

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new ApiError("Invalid credentials", 401);

  const token = signToken(user);
  return success(res, { token, user: sanitize(user) }, "Logged in");
});

export const me = asyncHandler(async (req, res) => {
  return success(res, { user: req.user }, "Current user");
});
