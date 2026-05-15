/**
 * Reusable, token-efficient healthcare prompt templates.
 * All templates assume inputs have been validated AND sanitized upstream.
 *
 * Tone rules (enforced in SAFETY_PREAMBLE):
 *  - No diagnosis, no medical certainty
 *  - No prescriptions, no dosages, no drug recommendations
 *  - Encourage seeing a doctor when relevant
 *  - Short, plain language, no markdown
 */

export const SAFETY_PREAMBLE =
  "You are Medora, a cautious healthcare wellness assistant. " +
  "RULES: do NOT diagnose, do NOT prescribe medication or dosage, do NOT make " +
  "medical certainty claims. Use soft language ('may', 'consider'). Encourage " +
  "consulting a clinician for medical concerns. Keep output plain text, no " +
  "markdown, no emojis, no lists unless asked.";

export const wellnessSummaryPrompt = ({
  sleepHours,
  hydrationLevel,
  steps,
  wellnessScore,
  mood,
}) =>
  `${SAFETY_PREAMBLE}\n\n` +
  `Given today's wellness stats, write exactly 3 short lines:\n` +
  `1) Summary (max 20 words)\n` +
  `2) Positive guidance (max 15 words)\n` +
  `3) One actionable wellness recommendation (max 15 words)\n\n` +
  `Stats: sleep=${sleepHours}h, hydration=${hydrationLevel}/10, ` +
  `steps=${steps}, mood=${mood}, wellnessScore=${wellnessScore}/100.`;

export const recoveryInsightPrompt = ({
  sleepHours,
  hydrationLevel,
  steps,
  wellnessScore,
  mood,
  adherenceRate,
}) =>
  `${SAFETY_PREAMBLE}\n\n` +
  `Given the user's recovery stats, write exactly 2 short sections:\n` +
  `1) Recovery analysis (max 25 words) — observational, no diagnosis\n` +
  `2) One concrete non-medical lifestyle improvement (max 20 words)\n\n` +
  `Stats: sleep=${sleepHours}h, hydration=${hydrationLevel}/10, ` +
  `steps=${steps}, mood=${mood}, wellnessScore=${wellnessScore}/100, ` +
  `medication adherence=${adherenceRate}%.`;

export const motivationPrompt = ({ mood, recoveryScore }) =>
  `${SAFETY_PREAMBLE}\n\n` +
  `Write ONE warm, energizing message (max 25 words) for someone with ` +
  `mood=${mood} and recoveryScore=${recoveryScore}/100. Tone: kind, ` +
  `grounded, hopeful. No medical advice.`;

// Single short disclaimer attached to AI responses by the backend.
export const AI_DISCLAIMER =
  "This information is AI-generated and not a replacement for professional medical advice.";
