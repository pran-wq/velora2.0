import { AISummaryPayload, ExtractedBiomarker } from '../types/medical';

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = 'mistral';

export async function generateAISummary(
  biomarkers: ExtractedBiomarker[],
  predictedDiseases: string,
  severityTier: string,
  confidence: number
): Promise<AISummaryPayload> {
  const abnormalBiomarkers = biomarkers.filter(b => b.status === 'Abnormal');
  const abnormalNames = abnormalBiomarkers.map(b => `${b.name} (${b.value} ${b.unit})`);

  const defaultPayload: AISummaryPayload = {
    detectedAbnormalities: abnormalNames.length > 0 ? abnormalNames : ['None identified'],
    simplifiedExplanation: `Analysis shows parameter readouts indicating ${predictedDiseases}. Biomarker mapping confirms a matching score of ${confidence}% aligned with physiological baseline datasets.`,
    possibleDisease: predictedDiseases,
    severity: severityTier,
    recommendations: [
      'Consult a licensed physician for full clinical review',
      'Increase dietary micronutrient density and trace mineral absorption',
      'Schedule a follow-up screening panel within 90 days to track trends'
    ],
    disclaimer: 'AI-generated screening results — not a medical diagnosis.'
  };

  try {
    const prompt = `
      You are an elite medical report formatting assistant. Review the following extracted data:
      Abnormal Biomarkers: ${abnormalNames.join(', ')}
      Primary Rule Engine Result: ${predictedDiseases}
      Severity Tier: ${severityTier}
      Confidence Index: ${confidence}%

      Provide a clear JSON object matching this exact TypeScript interface structure, without raw text or markdown codeblocks:
      {
        "detectedAbnormalities": ["item 1", "item 2"],
        "simplifiedExplanation": "Clear, plain explanation for the user",
        "possibleDisease": "${predictedDiseases}",
        "severity": "${severityTier}",
        "recommendations": ["Clear step 1", "Clear step 2", "Clear step 3"],
        "disclaimer": "AI-generated screening results — not a medical diagnosis."
      }
      DO NOT claim medical certainty. Keep descriptions strictly supportive.
    `;

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    if (!response.ok) return defaultPayload;
    const data = (await response.json()) as { response?: string };
    const content = (data.response || '').trim();
    if (!content) return defaultPayload;
    const parsed = JSON.parse(content);

    return {
      detectedAbnormalities: Array.isArray(parsed.detectedAbnormalities) ? parsed.detectedAbnormalities : defaultPayload.detectedAbnormalities,
      simplifiedExplanation: parsed.simplifiedExplanation || defaultPayload.simplifiedExplanation,
      possibleDisease: parsed.possibleDisease || defaultPayload.possibleDisease,
      severity: parsed.severity || defaultPayload.severity,
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : defaultPayload.recommendations,
      disclaimer: 'AI-generated screening results — not a medical diagnosis.'
    };
  } catch (error) {
    console.error('Ollama summary parsing error, leveraging native rules builder:', error);
    return defaultPayload;
  }
}
