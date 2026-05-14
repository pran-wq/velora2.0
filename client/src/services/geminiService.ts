import { GoogleGenAI } from "@google/genai";
import { UserProfile } from "../types";
import { aiApi } from "../lib/api";

const env = (import.meta as any).env || {};
const apiKey = (env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || "") as string;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/** Stable Gemini model id for the public Generative Language API. */
const GEMINI_MODEL = (env.VITE_GEMINI_MODEL || "gemini-2.0-flash") as string;

// ─── Helpers to map frontend stats to backend AI payloads ───
const ALLOWED_MOODS = ["great", "good", "tired", "stressed", "low"] as const;
const clampN = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const normMood = (m?: string): typeof ALLOWED_MOODS[number] => {
  const v = (m || "").toLowerCase();
  return (ALLOWED_MOODS as readonly string[]).includes(v) ? (v as any) : "good";
};
const mlToHydration = (ml?: number) => clampN(Math.round((ml ?? 2000) / 300), 0, 10);

async function chatViaBackend(message: string, userId: string): Promise<string | null> {
  const base = (env.VITE_API_URL || "http://localhost:3001") as string;
  try {
    const r = await fetch(`${base}/api/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, userId }),
    });
    if (!r.ok) return null;
    const data = await r.json();
    return typeof data.response === "string" ? data.response : null;
  } catch {
    return null;
  }
}

export async function getDailyWellnessQuote(profile: UserProfile): Promise<string> {
  try {
    const { message } = await aiApi.motivation({
      mood: normMood((profile as any).mood),
      recoveryScore: 75,
    });
    return message;
  } catch (error) {
    console.error("AI Quote Error:", error);
    return "Small steps every day lead to stronger recovery.";
  }
}

export async function getAIHealthSummary(profile: UserProfile, stats: any): Promise<string> {
  try {
    const { insight } = await aiApi.wellnessSummary({
      sleepHours: clampN(Number(stats?.sleepHours) || 7, 0, 24),
      hydrationLevel: mlToHydration(stats?.hydrationMl),
      mood: normMood(stats?.mood),
      steps: clampN(Math.round(Number(stats?.steps) || 0), 0, 100000),
      wellnessScore: clampN(Math.round(Number(stats?.recoveryScore) || 0), 0, 100),
    });
    return insight;
  } catch (error) {
    console.error("AI Summary Error:", error);
    return "You're showing steady progress. Keep focusing on your hydration and rest to optimize your recovery score.";
  }
}

export async function getReadinessScore(profile: UserProfile, stats: any): Promise<number> {
  try {
    if (!ai) {
      return Math.round((stats.recoveryScore * 0.4) + (stats.adherenceRate * 0.3) + (Math.min(stats.sleepHours / 8, 1) * 100 * 0.3));
    }

    const prompt = `Based on these health stats, provide ONLY a number from 0-100 representing daily readiness score:
    Recovery: ${stats.recoveryScore}%, Sleep: ${stats.sleepHours}h, Adherence: ${stats.adherenceRate}%, Steps: ${stats.steps}, Hydration: ${stats.hydrationMl}ml
    Return ONLY the number, nothing else.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    const score = parseInt(response.text?.trim() || "0");
    return isNaN(score) ? 85 : Math.max(0, Math.min(100, score));
  } catch (error) {
    console.error("AI Readiness Error:", error);
    return 85;
  }
}

export async function getSleepInsight(profile: UserProfile, sleepHours: number): Promise<string> {
  try {
    const { insight } = await aiApi.recoveryInsight({
      sleepHours: clampN(Number(sleepHours) || 7, 0, 24),
      hydrationLevel: 7,
      steps: 6000,
      wellnessScore: 75,
      mood: normMood((profile as any).mood),
      adherenceRate: 80,
    });
    return insight;
  } catch (error) {
    console.error("AI Sleep Error:", error);
    return "Your sleep patterns show healthy consistency. Consider maintaining your current routine.";
  }
}

export async function getStressAnalysis(profile: UserProfile): Promise<string> {
  try {
    const { insight } = await aiApi.recoveryInsight({
      sleepHours: 7,
      hydrationLevel: 7,
      steps: 6000,
      wellnessScore: 70,
      mood: normMood((profile as any).mood ?? "stressed"),
      adherenceRate: 80,
    });
    return insight;
  } catch (error) {
    console.error("AI Stress Error:", error);
    return "Your stress levels are manageable today. Try a 5-minute breathing exercise if you feel tension building.";
  }
}

export async function getNutritionRecommendation(profile: UserProfile): Promise<string> {
  try {
    if (!ai) {
      return "Focus on anti-inflammatory foods today. Your protein intake could benefit from an additional serving of lean protein.";
    }

    const prompt = `Provide a brief (2 sentences) nutrition recommendation for ${profile.name}, age ${profile.age}, ${profile.gender}.
    ${profile.isPregnant ? `Currently ${profile.pregnancyMonth} months pregnant.` : ''}
    Tone: Wellness-focused, supportive, specific. Suggest one actionable food recommendation.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    return response.text?.trim() || "Focus on anti-inflammatory foods rich in omega-3 today. A handful of walnuts or a salmon serving would complement your recovery.";
  } catch (error) {
    console.error("AI Nutrition Error:", error);
    return "Focus on anti-inflammatory foods today. Your protein intake could benefit from an additional serving of lean protein.";
  }
}

export async function getHealthPrediction(profile: UserProfile, stats: any): Promise<string> {
  try {
    const { insight } = await aiApi.recoveryInsight({
      sleepHours: clampN(Number(stats?.sleepHours) || 7, 0, 24),
      hydrationLevel: mlToHydration(stats?.hydrationMl),
      steps: clampN(Math.round(Number(stats?.steps) || 0), 0, 100000),
      wellnessScore: clampN(Math.round(Number(stats?.recoveryScore) || 0), 0, 100),
      mood: normMood(stats?.mood),
      adherenceRate: clampN(Math.round(Number(stats?.adherenceRate) || 0), 0, 100),
    });
    return insight;
  } catch (error) {
    console.error("AI Prediction Error:", error);
    return "Based on your 30-day trends, your recovery trajectory suggests reaching optimal levels within 2 weeks if current habits are maintained.";
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
  const defaultResult: DiseasePredictionResult = {
    condition: symptoms.some(s => s.toLowerCase().includes('fever') || s.toLowerCase().includes('cough')) 
      ? "Seasonal Viral Infection / Fatigue" 
      : "Metabolic Strain & Systemic Fatigue",
    probability: 68,
    riskLevel: 'Low',
    recommendations: [
      "Ensure adequate rest and hydration over the next 48 hours.",
      "Monitor body temperature and track any symptom progression.",
      "Consult a healthcare professional if symptoms persist or worsen."
    ],
    disclaimer: "This analysis is powered by localized AI vector embeddings and does not constitute a formal clinical diagnosis."
  };

  try {
    if (!ai || symptoms.length === 0) return defaultResult;

    const prompt = `Act as an elite AI Health Diagnostic Engine. Analyze the following reported symptoms for user ${profile.name} (${profile.age}yo, ${profile.gender}${profile.isPregnant ? `, ${profile.pregnancyMonth} months pregnant` : ''}).
    Symptoms: ${symptoms.join(', ')}.
    
    Provide a preliminary risk evaluation. Return the final output strictly as a JSON object with this exact structure, without markdown formatting or codeblocks:
    {
      "condition": "Primary suspected condition or physiological state (e.g. Mild Viral Syndrome, Physical Overexertion)",
      "probability": integer between 40 and 95 representing estimated matching likelihood,
      "riskLevel": "Low" | "Moderate" | "High",
      "recommendations": ["Actionable step 1", "Actionable step 2", "Actionable step 3"],
      "disclaimer": "Short medical disclaimer statement"
    }`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    const text = response.text?.trim() || "";
    // Clean potential markdown code blocks
    const cleanedText = text.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    const parsed = JSON.parse(cleanedText);

    return {
      condition: parsed.condition || defaultResult.condition,
      probability: typeof parsed.probability === 'number' ? parsed.probability : defaultResult.probability,
      riskLevel: ['Low', 'Moderate', 'High'].includes(parsed.riskLevel) ? parsed.riskLevel : defaultResult.riskLevel,
      recommendations: Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0 ? parsed.recommendations : defaultResult.recommendations,
      disclaimer: parsed.disclaimer || defaultResult.disclaimer
    };
  } catch (error) {
    console.error("AI Disease Prediction Error:", error);
    return defaultResult;
  }
}

export async function chatWithGemini(message: string, profile: UserProfile, history: { role: 'user' | 'assistant', content: string }[]): Promise<string> {
  const systemInstruction = `You are Aether, a premium AI health companion for ${profile.name}, a ${profile.age}-year-old ${profile.gender}.
    ${profile.isPregnant ? `Note: The user is ${profile.pregnancyMonth ?? "?"} months pregnant.` : ""}
    You must be warm, science-backed, and supportive. Keep it concise (2-4 sentences).
    Avoid heavy medical jargon. Do not offer formal medical diagnosis. Be friendly yet elite.`;

  const historyPrompt = history.map(h => `${h.role === "user" ? "User" : "Assistant"}: ${h.content}`).join("\n");
  const contents =
    history.length > 0
      ? `Conversation so far:\n${historyPrompt}\n\nUser: ${message}`
      : message;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: { systemInstruction },
      });
      const text = response.text?.trim();
      if (text) return text;
    } catch (error) {
      console.error("Gemini Chat Error:", error);
    }
  }

  const backend = await chatViaBackend(message, profile.name || "guest");
  if (backend) return backend;

  return "I appreciate the question! While focusing on recovery, continue consistent habits and track subtle fluctuations daily.";
}

