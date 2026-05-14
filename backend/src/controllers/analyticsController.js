import { readJSON } from "../utils/storage.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import { calculatePercentage, average, sortByCreatedAsc } from "../utils/helpers.js";

const MEDS = "medications";
const RECOVERY = "recovery";

// ---------- helpers ----------
const loadUserData = async (userId) => {
  const [meds, recovery] = await Promise.all([
    readJSON(MEDS, []),
    readJSON(RECOVERY, []),
  ]);
  return {
    meds: meds.filter((m) => m.userId === userId),
    recovery: recovery.filter((r) => r.userId === userId),
  };
};

// ---------- GET /api/analytics/dashboard ----------
export const dashboard = asyncHandler(async (req, res) => {
  const { meds, recovery } = await loadUserData(req.user.id);

  const totalMedications = meds.length;
  const medicationsTaken = meds.filter((m) => m.status === "taken").length;
  const adherencePercentage = calculatePercentage(medicationsTaken, totalMedications);

  const averageWellnessScore = average(recovery.map((r) => r.wellnessScore || 0));

  const sortedRecovery = sortByCreatedAsc(recovery);
  const latest = sortedRecovery[sortedRecovery.length - 1] || null;

  return success(
    res,
    {
      totalMedications,
      medicationsTaken,
      adherencePercentage,
      averageWellnessScore,
      latestMood: latest?.mood ?? null,
      latestRecoveryScore: latest?.wellnessScore ?? null,
    },
    "Dashboard summary"
  );
});

// ---------- GET /api/analytics/recovery-trends ----------
export const recoveryTrends = asyncHandler(async (req, res) => {
  const all = await readJSON(RECOVERY, []);
  const mine = sortByCreatedAsc(all.filter((r) => r.userId === req.user.id));

  const trends = mine.map((r) => ({
    date: r.createdAt,
    wellnessScore: r.wellnessScore,
    sleepHours: r.sleepHours,
    hydrationLevel: r.hydrationLevel,
    steps: r.steps,
  }));

  return success(res, { trends }, "Recovery trends");
});

// ---------- GET /api/analytics/adherence ----------
export const adherence = asyncHandler(async (req, res) => {
  const all = await readJSON(MEDS, []);
  const mine = all.filter((m) => m.userId === req.user.id);

  const total = mine.length;
  const taken = mine.filter((m) => m.status === "taken").length;
  const missed = mine.filter((m) => m.status === "missed").length;
  const pending = mine.filter((m) => m.status === "pending").length;

  return success(
    res,
    {
      total,
      taken,
      missed,
      pending,
      adherencePercentage: calculatePercentage(taken, total),
    },
    "Medication adherence stats"
  );
});

// ---------- GET /api/analytics/mood ----------
export const mood = asyncHandler(async (req, res) => {
  const all = await readJSON(RECOVERY, []);
  const mine = sortByCreatedAsc(all.filter((r) => r.userId === req.user.id));

  const moodCounts = mine.reduce((acc, r) => {
    if (r.mood) acc[r.mood] = (acc[r.mood] || 0) + 1;
    return acc;
  }, {});

  // last 7 mood entries (oldest -> newest), chart-ready
  const recent = mine.slice(-7).map((r) => ({ date: r.createdAt, mood: r.mood }));

  return success(
    res,
    {
      moodCounts,
      recentTrend: recent,
      latestMood: recent.length ? recent[recent.length - 1].mood : null,
    },
    "Mood analytics"
  );
});
