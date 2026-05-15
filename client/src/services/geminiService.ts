import { UserProfile } from "../types";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const OLLAMA_MODEL = "mistral";

async function ollamaGenerate(prompt: string): Promise<string> {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: prompt,
      stream: false,
      options: {
        num_predict: 120,
        temperature: 0.3,
      },
    }),
  });
  if (!response.ok) {
    throw new Error(`Ollama error (${response.status})`);
  }
  const data = await response.json();
  return data.response;
}

async function chatViaBackend(message: string, userId: string): Promise<string> {
  const base = import.meta.env.DEV ? "" : String(import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const url = `${base}/api/ai/chat`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, userId }),
  });
  const data = (await r.json().catch(() => ({}))) as { response?: string; error?: string };
  if (!r.ok) {
    throw new Error(typeof data.error === "string" ? data.error : `Chat request failed (${r.status})`);
  }
  const text = typeof data.response === "string" ? data.response.trim() : "";
  if (!text) throw new Error("Empty response from the chat server.");
  return text;
}

export async function getDailyWellnessQuote(profile: UserProfile): Promise<string> {
  try {
    const prompt = `Generate a calming, emotionally supportive, and premium wellness quote for a ${profile.age} year old ${profile.gender} user named ${profile.name}.
    ${profile.isPregnant ? `The user is ${profile.pregnancyMonth} months pregnant.` : ''}
    Keep it short (under 15 words). The tone should be like a luxury wellness assistant. Avoid hospital vibes.`;
    const text = await ollamaGenerate(prompt);
    return text.trim() || "Take a slow breath — you are allowed to rest.";
  } catch (error) {
    console.error("AI Quote Error:", error);
    return "Could not load a quote right now.";
  }
}

export async function getAIHealthSummary(profile: UserProfile, stats: any): Promise<string> {
  try {
    const prompt = `Provide a very brief (2 sentences) AI health summary for ${profile.name}.
    Context:
    - Recovery Score: ${stats.recoveryScore}%
    - Adherence: ${stats.adherenceRate}%
    - Steps: ${stats.steps}
    Tone: Supportive, emotionally intelligent, premium.
    Focus on positive trends or gentle encouragement.`;
    const text = await ollamaGenerate(prompt);
    return text.trim() || "Summary unavailable.";
  } catch (error) {
    console.error("AI Summary Error:", error);
    return "Could not generate a summary.";
  }
}

export async function getReadinessScore(profile: UserProfile, stats: any): Promise<number> {
  try {
    const prompt = `Based on these health stats, provide ONLY a number from 0-100 representing daily readiness score:
    Recovery: ${stats.recoveryScore}%, Sleep: ${stats.sleepHours}h, Adherence: ${stats.adherenceRate}%, Steps: ${stats.steps}, Hydration: ${stats.hydrationMl}ml
    Return ONLY the number, nothing else.`;
    const text = await ollamaGenerate(prompt);
    const score = parseInt(text.trim() || "0");
    return isNaN(score) ? 85 : Math.max(0, Math.min(100, score));
  } catch (error) {
    console.error("AI Readiness Error:", error);
    return Math.round(
      (stats.recoveryScore || 0) * 0.4 + (stats.adherenceRate || 0) * 0.3 + Math.min((stats.sleepHours || 0) / 8, 1) * 100 * 0.3
    );
  }
}

export async function getSleepInsight(profile: UserProfile, sleepHours: number): Promise<string> {
  try {
    const prompt = `Provide a brief (2 sentences) AI sleep analysis for ${profile.name} who slept ${sleepHours} hours.
    Tone: Calming, supportive, scientifically grounded. Focus on actionable improvement or positive reinforcement.`;
    const text = await ollamaGenerate(prompt);
    return text.trim() || "Sleep insight unavailable.";
  } catch (error) {
    console.error("AI Sleep Error:", error);
    return "Could not load sleep insight.";
  }
}

export async function getStressAnalysis(profile: UserProfile): Promise<string> {
  try {
    const prompt = `Provide a brief (2 sentences) stress analysis for ${profile.name}.
    Tone: Calm, reassuring, practical. Include one actionable suggestion.`;
    const text = await ollamaGenerate(prompt);
    return text.trim() || "Stress analysis unavailable.";
  } catch (error) {
    console.error("AI Stress Error:", error);
    return "Could not load stress analysis.";
  }
}

export async function getNutritionRecommendation(profile: UserProfile): Promise<string> {
  try {
    const prompt = `Provide a brief (2 sentences) nutrition recommendation for ${profile.name}, age ${profile.age}, ${profile.gender}.
    ${profile.isPregnant ? `Currently ${profile.pregnancyMonth} months pregnant.` : ''}
    Tone: Wellness-focused, supportive, specific. Suggest one actionable food recommendation.`;
    const text = await ollamaGenerate(prompt);
    return text.trim() || "Nutrition tip unavailable.";
  } catch (error) {
    console.error("AI Nutrition Error:", error);
    return "Could not load nutrition guidance.";
  }
}

export async function getHealthPrediction(profile: UserProfile, stats: any): Promise<string> {
  try {
    const prompt = `Provide a brief (2 sentences) predictive health insight for ${profile.name}.
    Stats: Recovery ${stats.recoveryScore}%, Steps ${stats.steps}, Sleep ${stats.sleepHours}h.
    Tone: Forward-looking, motivating, data-driven. Focus on positive trajectory.`;
    const text = await ollamaGenerate(prompt);
    return text.trim() || "Prediction text unavailable.";
  } catch (error) {
    console.error("AI Prediction Error:", error);
    return "Could not load prediction insight.";
  }
}

export interface DiseasePredictionResult {
  condition: string;
  probability: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  recommendations: string[];
  disclaimer: string;
}

export async function predictDisease(symptoms: string[], profile: UserProfile): Promise<DiseasePredictionResult> {
  if (!symptoms.length) {
    throw new Error("Select at least one symptom before running analysis.");
  }

  const prompt = `Act as a cautious AI health triage assistant. Analyze the following reported symptoms for user ${profile.name} (${profile.age}yo, ${profile.gender}${profile.isPregnant ? `, ${profile.pregnancyMonth} months pregnant` : ""}).
    Symptoms: ${symptoms.join(", ")}.

    Provide a preliminary risk evaluation only — not a diagnosis. Return the final output strictly as a JSON object with this exact structure, without markdown formatting or codeblocks:
    {
      "condition": "Primary suspected condition or physiological state (e.g. Mild Viral Syndrome, Physical Overexertion)",
      "probability": integer between 40 and 95 representing estimated matching likelihood,
      "riskLevel": "Low" | "Moderate" | "High",
      "recommendations": ["Actionable step 1", "Actionable step 2", "Actionable step 3"],
      "disclaimer": "Short medical disclaimer statement"
    }`;

  const text = await ollamaGenerate(prompt);
  const cleanedText = text.trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleanedText) as Record<string, unknown>;
  } catch {
    throw new Error("Model output was not valid JSON. Try again.");
  }

  if (typeof parsed.condition !== "string" || !parsed.condition.trim()) {
    throw new Error("Model returned an invalid condition field.");
  }

  if (typeof parsed.probability !== "number" || Number.isNaN(parsed.probability)) {
    throw new Error("Model returned an invalid probability value.");
  }

  if (!Array.isArray(parsed.recommendations) || parsed.recommendations.length === 0) {
    throw new Error("Model returned no recommendations.");
  }

  if (!["Low", "Moderate", "High"].includes(parsed.riskLevel as string)) {
    throw new Error("Model returned an invalid riskLevel.");
  }

  return {
    condition: parsed.condition,
    probability: parsed.probability,
    riskLevel: parsed.riskLevel as DiseasePredictionResult["riskLevel"],
    recommendations: parsed.recommendations as string[],
    disclaimer: typeof parsed.disclaimer === "string" ? parsed.disclaimer : "Educational only — not a medical diagnosis.",
  };
}

export async function chatWithGemini(message: string, profile: UserProfile, history: { role: 'user' | 'assistant', content: string }[]): Promise<string> {
  const systemInstruction = `You are an AI healthcare assistant for preventive healthcare and outbreak awareness.
You are chatting with ${profile.name}, a ${profile.age}-year-old ${profile.gender}.
${profile.isPregnant ? `The user is ${profile.pregnancyMonth ?? "?"} months pregnant.` : ""}

Provide concise, safe, non-alarming medical guidance.
Never claim to replace doctors or provide a definitive diagnosis.
Always recommend professional consultation for serious or worsening symptoms.

You ONLY discuss health, wellness, symptoms, prevention, nutrition, sleep, fitness, mental wellbeing, medications at a general education level (no dosing), medical reports at a high level, vaccines, hygiene, and when to seek care.
If the user asks about anything outside healthcare, briefly refuse and redirect to a health topic.

For symptom questions: offer differentials (not a diagnosis), practical self-care, red flags for urgent care, and general public-health context only — never invent official alerts.

Tone: warm, concise (about 2–5 short paragraphs unless they ask for more detail), science-aware, no alarmism.`;

  try {
    const historyPrompt = history.map((h) => `${h.role === "user" ? "User" : "Assistant"}: ${h.content}`).join("\n");
    const prompt = `${systemInstruction}\n\n${historyPrompt ? historyPrompt + "\n\n" : ""}User: ${message}\nAssistant:`;
    const text = await ollamaGenerate(prompt);
    return text.trim();
  } catch (err) {
    console.error("Ollama chat error:", err);
  }

  try {
    return await chatViaBackend(message, profile.name || "guest");
  } catch (backendErr) {
    console.error("Backend chat error:", backendErr);
  }

  throw new Error(
    "Could not get a response from the AI. Confirm Ollama is running (http://localhost:11434) and the dev server is running."
  );
}

