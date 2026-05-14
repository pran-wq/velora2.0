/**
 * Lightweight sanitizer for user-provided text that gets embedded in AI prompts.
 * Removes common prompt-injection patterns and caps length.
 *
 * NOT meant to be a security firewall — defense-in-depth only.
 */

const MAX_LEN = 500;

// Patterns that try to break out of the system prompt / inject instructions.
const INJECTION_PATTERNS = [
  // "ignore [up to 4 words] instructions/prompts/rules"
  /ignore\s+(?:\w+\s+){0,4}(?:instructions?|prompts?|rules?)/gi,
  // bare "ignore previous/all/prior/the above"
  /ignore\s+(?:all|previous|prior|the\s+above)\b/gi,
  /disregard\s+(?:all|previous|prior|the\s+above)/gi,
  /you\s+are\s+(?:now|actually)\s+/gi,
  /forget\s+(?:everything|all)\s+(?:you|previously)/gi,
  /\bsystem\s*:/gi,
  /\bassistant\s*:/gi,
  /<\|.*?\|>/g, // chat-template tokens
  /\[INST\]|\[\/INST\]/gi,
  /```/g, // code fences could be used to nest fake prompts
];

/**
 * Sanitize a single string for safe inclusion in a prompt.
 */
export const sanitizeText = (input) => {
  if (input === null || input === undefined) return "";
  let s = String(input);

  // Strip control chars (keep \n \t)
  s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Neutralize injection patterns
  for (const re of INJECTION_PATTERNS) s = s.replace(re, "[redacted]");

  // Collapse excessive whitespace
  s = s.replace(/\s+/g, " ").trim();

  // Cap length
  if (s.length > MAX_LEN) s = s.slice(0, MAX_LEN) + "…";

  return s;
};

/**
 * Sanitize each string value of an object (shallow). Non-string values pass through.
 */
export const sanitizeAiInput = (obj = {}) => {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = typeof v === "string" ? sanitizeText(v) : v;
  }
  return out;
};

export default sanitizeAiInput;
