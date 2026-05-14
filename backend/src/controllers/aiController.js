import { asyncHandler } from "../utils/asyncHandler.js";
import { success, ApiError } from "../utils/response.js";
import { generateContent, AI_DISCLAIMER } from "../services/geminiService.js";

const ALLOWED_MOODS = ["great", "good", "tired", "stressed", "low"];

// ---------- light validators ----------
const reqNum = (v, name, min, max) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n < min || n > max)
    throw new ApiError(`${name} must be a number between ${min} and ${max}`, 400);
  return n;
};

const reqMood = (v) => {
  if (typeof v !== "string" || !ALLOWED_MOODS.includes(v))
    throw new ApiError(`mood must be one of: ${ALLOWED_MOODS.join(", ")}`, 400);
  return v;
};

// ---------- POST /api/ai/wellness-summary ----------
export const wellnessSummary = asyncHandler(async (req, res) => {
  const { sleepHours, hydrationLevel, mood, steps, wellnessScore } = req.body || {};

  const data = {
    sleepHours: reqNum(sleepHours, "sleepHours", 0, 24),
    hydrationLevel: reqNum(hydrationLevel, "hydrationLevel", 0, 10),
    steps: reqNum(steps, "steps", 0, 100000),
    wellnessScore: reqNum(wellnessScore, "wellnessScore", 0, 100),
    mood: reqMood(mood),
  };

  const prompt =
    `You are a healthcare wellness assistant. Given the user's daily stats, ` +
    `respond in 3 SHORT lines:\n` +
    `1) Summary (max 20 words)\n` +
    `2) Positive guidance (max 15 words)\n` +
    `3) One actionable recommendation (max 15 words)\n\n` +
    `Stats: sleep=${data.sleepHours}h, hydration=${data.hydrationLevel}/10, ` +
    `steps=${data.steps}, mood=${data.mood}, wellnessScore=${data.wellnessScore}/100.\n` +
    `No disclaimers. No markdown.`;

  const text = await generateContent(prompt);
  return success(res, { insight: text, disclaimer: AI_DISCLAIMER }, "Wellness summary generated");
});

// ---------- POST /api/ai/recovery-insight ----------
export const recoveryInsight = asyncHandler(async (req, res) => {
  const { sleepHours, hydrationLevel, steps, wellnessScore, mood, adherenceRate } =
    req.body || {};

  const data = {
    sleepHours: reqNum(sleepHours, "sleepHours", 0, 24),
    hydrationLevel: reqNum(hydrationLevel, "hydrationLevel", 0, 10),
    steps: reqNum(steps, "steps", 0, 100000),
    wellnessScore: reqNum(wellnessScore, "wellnessScore", 0, 100),
    adherenceRate: reqNum(adherenceRate, "adherenceRate", 0, 100),
    mood: reqMood(mood),
  };

  const prompt =
    `You are a healthcare recovery analyst. Given the patient's recovery stats, ` +
    `respond in 2 SHORT sections:\n` +
    `1) Recovery analysis (max 25 words)\n` +
    `2) One concrete improvement suggestion (max 20 words)\n\n` +
    `Stats: sleep=${data.sleepHours}h, hydration=${data.hydrationLevel}/10, ` +
    `steps=${data.steps}, mood=${data.mood}, wellnessScore=${data.wellnessScore}/100, ` +
    `medication adherence=${data.adherenceRate}%.\n` +
    `No disclaimers. No markdown.`;

  const text = await generateContent(prompt);
  return success(res, { insight: text, disclaimer: AI_DISCLAIMER }, "Recovery insight generated");
});

// ---------- POST /api/ai/motivation ----------
export const motivation = asyncHandler(async (req, res) => {
  const { mood, recoveryScore } = req.body || {};

  const data = {
    mood: reqMood(mood),
    recoveryScore: reqNum(recoveryScore, "recoveryScore", 0, 100),
  };

  const prompt =
    `You are a warm healthcare motivator. Given mood=${data.mood} and ` +
    `recoveryScore=${data.recoveryScore}/100, write ONE encouraging healthcare ` +
    `message (max 25 words). Tone: kind, energizing, grounded. No emojis, no markdown.`;

  const text = await generateContent(prompt);
  return success(res, { message: text, disclaimer: AI_DISCLAIMER }, "Motivation generated");
});
