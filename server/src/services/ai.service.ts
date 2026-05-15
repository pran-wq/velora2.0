const OLLAMA_URL = 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = 'mistral';

const SYSTEM_INSTRUCTION = `You are an AI healthcare assistant for preventive healthcare and outbreak awareness.
Provide concise, safe, non-alarming medical guidance.
Never claim to replace doctors or issue a definitive diagnosis.
Always recommend professional consultation for serious or worsening symptoms.
If asked about non-health topics, briefly refuse and steer back to wellness.
For outbreaks, give general public-health context only—do not invent official alerts.`;

async function ollamaGenerate(prompt: string): Promise<string> {
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
  if (!response.ok) {
    throw new Error(`Ollama error (${response.status})`);
  }
  const data = await response.json();
  return data.response;
}

export async function generateChatResponse(message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[]) {
  const historyText = history
    .map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.parts[0]?.text || ''}`)
    .join('\n');

  const prompt = `${SYSTEM_INSTRUCTION}\n\n${historyText ? historyText + '\n\n' : ''}User: ${message}\nAssistant:`;

  try {
    return await ollamaGenerate(prompt);
  } catch (err) {
    console.error('Ollama chat error:', err);
    throw new Error('AI service temporarily unavailable. Please try again.');
  }
}

export async function analyzeHealthData(data: any) {
  const prompt = `Analyze the following health data and provide 3 key insights:\n${JSON.stringify(data)}`;
  try {
    return await ollamaGenerate(prompt);
  } catch (err) {
    console.error('Ollama analysis error:', err);
    return "Based on your health data: 1) Maintain consistent sleep and hydration. 2) Track trends over time rather than single measurements. 3) Share detailed records with your clinician for personalized interpretation.";
  }
}
