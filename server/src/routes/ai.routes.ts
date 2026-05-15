import { Router } from 'express';
import multer from 'multer';
import { generateChatResponse } from '../services/ai.service.js';
import { analyzeMedicalReportBuffer } from '../services/medicalReportAnalysis.service.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = new Set([
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'text/plain',
      'text/csv',
      'application/dicom',
    ]);
    if (ok.has(file.mimetype)) cb(null, true);
    else cb(new Error(`Unsupported file type: ${file.mimetype}`));
  },
});

const chatHistory: Record<string, { role: string; content: string }[]> = {};

router.post('/chat', async (req, res) => {
  try {
    const { message, userId = 'guest' } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    if (!chatHistory[userId]) {
      chatHistory[userId] = [];
    }

    const history = chatHistory[userId].slice(-16).map((msg) => ({
      role: msg.role === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: msg.content }],
    }));

    const response = await generateChatResponse(message, history);

    chatHistory[userId].push({ role: 'user', content: message });
    chatHistory[userId].push({ role: 'assistant', content: response });

    res.json({ response });
  } catch (error) {
    console.error('AI Chat Error:', error);
    const msg = error instanceof Error ? error.message : 'Chat failed';
    res.status(502).json({ error: msg });
  }
});

router.post('/medical-report', (req, res, next) => {
  upload.single('file')(req, res, (err: unknown) => {
    if (err) {
      const msg = err instanceof Error ? err.message : 'Upload error';
      return res.status(400).json({ error: msg });
    }
    next();
  });
}, async (req, res) => {
  try {
    const pasted = typeof req.body?.extractedText === 'string' ? req.body.extractedText : '';

    if (req.file) {
      const result = await analyzeMedicalReportBuffer(req.file.buffer, req.file.mimetype, req.file.originalname, pasted);
      return res.json(result);
    }

    if (pasted.trim().length > 0) {
      const result = await analyzeMedicalReportBuffer(Buffer.alloc(0), 'text/plain', 'pasted-report.txt', pasted);
      return res.json(result);
    }

    return res.status(400).json({ error: 'Provide a file (PDF or image) or pasted report text in extractedText.' });
  } catch (error) {
    console.error('Medical report route error:', error);
    const msg = error instanceof Error ? error.message : 'Analysis failed';
    return res.status(422).json({ error: msg });
  }
});

export default router;
