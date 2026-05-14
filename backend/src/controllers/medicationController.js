import {
  readJSON,
  writeJSON,
  appendItem,
  updateItem,
  removeItem,
} from "../utils/storage.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success, created, ApiError } from "../utils/response.js";
import { generateId, formatDate } from "../utils/helpers.js";
import {
  MED_FREQUENCIES,
  MED_STATUSES,
  TIME_REGEX,
} from "../utils/constants.js";

const MEDS = "medications";

const validateMed = (body, partial = false) => {
  const { medicineName, dosage, frequency, reminderTime, refillDate, status } =
    body || {};
  const patch = {};

  if (medicineName !== undefined) {
    if (typeof medicineName !== "string" || !medicineName.trim())
      throw new ApiError("medicineName is required", 400);
    patch.medicineName = medicineName.trim();
  } else if (!partial) {
    throw new ApiError("medicineName is required", 400);
  }

  if (dosage !== undefined) {
    if (typeof dosage !== "string" || !dosage.trim())
      throw new ApiError("dosage is required (e.g. '500mg')", 400);
    patch.dosage = dosage.trim();
  } else if (!partial) {
    throw new ApiError("dosage is required", 400);
  }

  if (frequency !== undefined) {
    if (!MED_FREQUENCIES.includes(frequency))
      throw new ApiError(
        `frequency must be one of: ${MED_FREQUENCIES.join(", ")}`,
        400
      );
    patch.frequency = frequency;
  } else if (!partial) {
    throw new ApiError("frequency is required", 400);
  }

  if (reminderTime !== undefined) {
    if (typeof reminderTime !== "string" || !TIME_REGEX.test(reminderTime))
      throw new ApiError("reminderTime must be HH:MM (24h)", 400);
    patch.reminderTime = reminderTime;
  } else if (!partial) {
    throw new ApiError("reminderTime is required (HH:MM)", 400);
  }

  if (refillDate !== undefined) {
    if (refillDate !== null) {
      const d = new Date(refillDate);
      if (Number.isNaN(d.getTime()))
        throw new ApiError("refillDate must be a valid ISO date", 400);
      patch.refillDate = d.toISOString();
    } else {
      patch.refillDate = null;
    }
  }

  if (status !== undefined) {
    if (!MED_STATUSES.includes(status))
      throw new ApiError(
        `status must be one of: ${MED_STATUSES.join(", ")}`,
        400
      );
    patch.status = status;
  }

  return patch;
};

// POST /api/medications
export const addMedication = asyncHandler(async (req, res) => {
  const fields = validateMed(req.body, false);

  const med = {
    id: generateId(),
    userId: req.user.id,
    ...fields,
    status: fields.status || "pending",
    adherenceCount: 0,
    refillDate: fields.refillDate ?? null,
    createdAt: formatDate(),
  };

  await appendItem(MEDS, med);
  return created(res, { medication: med }, "Medication added");
});

// GET /api/medications
export const getMedications = asyncHandler(async (req, res) => {
  const all = await readJSON(MEDS, []);
  const mine = all.filter((m) => m.userId === req.user.id);
  return success(res, { medications: mine }, "Medications fetched");
});

// helper: load + own-or-404
const findOwned = async (id, userId) => {
  const all = await readJSON(MEDS, []);
  const med = all.find((m) => m.id === id);
  if (!med || med.userId !== userId)
    throw new ApiError("Medication not found", 404);
  return med;
};

// PUT /api/medications/:id
export const updateMedication = asyncHandler(async (req, res) => {
  await findOwned(req.params.id, req.user.id);

  const patch = validateMed(req.body, true);
  if (Object.keys(patch).length === 0)
    throw new ApiError("No valid fields provided to update", 400);

  patch.updatedAt = formatDate();

  const updated = await updateItem(
    MEDS,
    (m) => m.id === req.params.id && m.userId === req.user.id,
    patch
  );
  return success(res, { medication: updated }, "Medication updated");
});

// DELETE /api/medications/:id
export const deleteMedication = asyncHandler(async (req, res) => {
  await findOwned(req.params.id, req.user.id);
  await removeItem(
    MEDS,
    (m) => m.id === req.params.id && m.userId === req.user.id
  );
  return success(res, { id: req.params.id }, "Medication deleted");
});

// PATCH /api/medications/:id/taken
export const markAsTaken = asyncHandler(async (req, res) => {
  const med = await findOwned(req.params.id, req.user.id);

  const all = await readJSON(MEDS, []);
  const idx = all.findIndex((m) => m.id === med.id);
  all[idx] = {
    ...all[idx],
    status: "taken",
    adherenceCount: (all[idx].adherenceCount || 0) + 1,
    lastTakenAt: formatDate(),
  };
  await writeJSON(MEDS, all);

  return success(res, { medication: all[idx] }, "Marked as taken");
});
