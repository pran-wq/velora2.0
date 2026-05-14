const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_INSTRUCTION = `
You are Aether AI, a premium healthcare intelligence assistant.
Your goal is to provide accurate, empathetic, and actionable health insights.
Always maintain a professional yet warm tone.
If you are unsure about a medical fact, suggest consulting a healthcare professional.
`;

export async function generateChatResponse(message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[]) {
  if (!GEMINI_API_KEY) {
    return 'Add GEMINI_API_KEY to the server .env to enable live AI replies. Until then, focus on steady sleep, hydration, and gentle movement today.';
  }

  const payload = {
    contents: [
      ...history,
      { role: 'user', parts: [{ text: message }] }
    ],
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    }
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty model response');
  return text;
}

export async function analyzeHealthData(data: any) {
  if (!GEMINI_API_KEY) {
    return 'Configure GEMINI_API_KEY on the server to analyze health data with Gemini.';
  }

  const payload = {
    contents: [{ parts: [{ text: `Analyze the following health data and provide 3 key insights: ${JSON.stringify(data)}` }] }]
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const resData = await response.json();
  if (resData.error) throw new Error(resData.error.message);

  return resData.candidates[0].content.parts[0].text;
}
