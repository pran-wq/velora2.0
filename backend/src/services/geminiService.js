import { GoogleGenerativeAI } from "@google/generative-ai";

import { ApiError } from "../utils/response.js";
import { logger } from "../utils/logger.js";

// Re-export disclaimer from the central template module so consumers
// have a single source of truth.
export { AI_DISCLAIMER } from "../utils/promptTemplates.js";

const MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

// Hard caps to keep output safe + cheap.
const GENERATION_CONFIG = {
  temperature: 0.6,
  maxOutputTokens: 200,
};

let _model = null;

const getModel = () => {
  if (_model) return _model;
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "your_gemini_api_key_here")
    throw new ApiError("GEMINI_API_KEY not configured", 500);
  const client = new GoogleGenerativeAI(key);
  _model = client.getGenerativeModel({
    model: MODEL,
    generationConfig: GENERATION_CONFIG,
  });
  return _model;
};

/**
 * Reusable one-shot text generation.
 * Callers must pass a template-built prompt with already-sanitized inputs
 * (see utils/sanitizeAiInput.js + utils/promptTemplates.js).
 */
export const generateContent = async (prompt) => {
  if (!prompt || typeof prompt !== "string")
    throw new ApiError("Prompt must be a non-empty string", 400);

  try {
    const model = getModel();
    logger.info(`ai.generate: model=${MODEL} promptLen=${prompt.length}`);
    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.();
    if (!text) throw new ApiError("Empty AI response", 502);
    return text.trim();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    logger.error("Gemini error:", err.message);
    throw new ApiError("AI service failed", 502, err.message);
  }
};
