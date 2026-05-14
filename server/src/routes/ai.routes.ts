import { Router } from 'express';
import { generateChatResponse } from '../services/ai.service.js';

const router = Router();

// In-memory mock history for now (since Prisma is failing to generate)
const mockHistory: Record<string, any[]> = {};

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, userId = 'guest' } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // Get or initialize history
    if (!mockHistory[userId]) {
      mockHistory[userId] = [];
    }

    const history = mockHistory[userId].slice(-10).map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.content }],
    }));

    const response = await generateChatResponse(message, history);

    // Save to mock history
    mockHistory[userId].push({ role: 'user', content: message });
    mockHistory[userId].push({ role: 'assistant', content: response });

    res.json({ response });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(200).json({
      response:
        'I could not reach the AI service. Add GEMINI_API_KEY to the server environment, or set VITE_GEMINI_API_KEY for the browser client.',
    });
  }
});

export default router;
