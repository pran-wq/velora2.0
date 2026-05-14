import { GoogleGenerativeAI } from "@google/generative-ai";

import { ApiError } from "../utils/response.js";
import { logger } from "../utils/logger.js";

const MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

let _model = null;

const getModel = () => {
  if (_model) return _model;
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "your_gemini_api_key_here")
    throw new ApiError("GEMINI_API_KEY not configured", 500);
  const client = new GoogleGenerativeAI(key);
  _model = client.getGenerativeModel({ model: MODEL });
  return _model;
};

/**
 * Reusable one-shot text generation.
 * Keep prompts SHORT and structured. Returns plain text.
 */
export const generateContent = async (prompt) => {
  if (!prompt || typeof prompt !== "string")
    throw new ApiError("Prompt must be a non-empty string", 400);

  try {
    const model = getModel();
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

export const AI_DISCLAIMER =
  "This AI insight is informational only and is not a substitute for professional medical advice.";
