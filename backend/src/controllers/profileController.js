import { updateItem } from "../utils/storage.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success, ApiError } from "../utils/response.js";
import { sanitizeUser, formatDate, safeNumber } from "../utils/helpers.js";
import { GENDERS } from "../utils/constants.js";

const USERS = "users";

// GET /api/profile — return the authenticated user (req.user is already sanitized by authMiddleware)
export const getProfile = asyncHandler(async (req, res) => {
  return success(res, { user: req.user }, "Profile fetched");
});

// PUT /api/profile — update editable fields
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, age, gender, bloodGroup, preferences } = req.body || {};
  const patch = {};

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim())
      throw new ApiError("name cannot be empty", 400);
    patch.name = name.trim();
  }

  if (age !== undefined) {
    const n = safeNumber(age, { min: 0, max: 130 });
    if (n === null || !Number.isInteger(n))
      throw new ApiError("Invalid age", 400);
    patch.age = n;
  }

  if (gender !== undefined) {
    if (typeof gender !== "string" || !GENDERS.includes(gender.toLowerCase()))
      throw new ApiError(`gender must be one of: ${GENDERS.join(", ")}`, 400);
    patch.gender = gender.toLowerCase();
  }

  if (bloodGroup !== undefined) {
    if (typeof bloodGroup !== "string" || !bloodGroup.trim())
      throw new ApiError("bloodGroup cannot be empty", 400);
    patch.bloodGroup = bloodGroup.trim();
  }

  if (preferences !== undefined) {
    if (typeof preferences !== "object" || preferences === null || Array.isArray(preferences))
      throw new ApiError("preferences must be an object", 400);
    patch.preferences = preferences;
  }

  if (Object.keys(patch).length === 0)
    throw new ApiError("No valid fields provided to update", 400);

  patch.updatedAt = formatDate();

  const updated = await updateItem(USERS, (u) => u.id === req.user.id, patch);
  if (!updated) throw new ApiError("User not found", 404);

  return success(res, { user: sanitizeUser(updated) }, "Profile updated");
});
