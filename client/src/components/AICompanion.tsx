import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, X, Bot, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { chatWithGemini } from '../services/geminiService';
import { TypingText } from './TypingText';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AICompanion() {
  const { profile } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi — I'm Aether AI, your healthcare-only assistant. Ask about symptoms, prevention, sleep, nutrition, or outbreaks in general terms. I remember this conversation while the app is open.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    setIsLoading(true);

    try {
      const activeProfile = profile || {
        id: 'guest',
        firebaseUid: 'guest',
        email: 'rahul@aether.health',
        name: 'Rahul',
        gender: 'Male',
        age: 28,
        weight: 70,
        bloodGroup: 'O+',
        isPregnant: false,
        healthGoals: ['Optimize recovery', 'Improve deep sleep'],
        conditions: [],
        accessibilityMode: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const historyContext = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const responseText = await chatWithGemini(userMessage, activeProfile, historyContext);
      setMessages((prev) => [...prev, { role: 'assistant', content: responseText }]);
    } catch (error) {
      console.error('AI Companion Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            error instanceof Error
              ? error.message
              : 'Could not reach the AI service. Confirm GEMINI_API_KEY is in .env.local, npm run dev is running, and try again. For emergencies, seek urgent care.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#2D2D2D] text-white rounded-full flex items-center justify-center shadow-2xl z-50 border border-white/10"
        aria-label="Open AI health assistant"
      >
        <Sparkles size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[min(400px,calc(100vw-2rem))] h-[min(600px,70vh)] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-100"
          >
            <div className="p-6 bg-[#2D2D2D] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold tracking-tight">Aether AI</h3>
                  <p className="text-[10px] uppercase tracking-widest text-white/50 font-black">Healthcare chat</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
              {messages.map((msg, i) => (
                <motion.div
                  key={`${i}-${msg.content.slice(0, 24)}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[90%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user' ? 'bg-[#2D2D2D]' : 'bg-white border border-gray-100 shadow-sm'
                      }`}
                    >
                      {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-[#2D2D2D]" />}
                    </div>
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' ? 'bg-[#2D2D2D] text-white' : 'bg-white border border-gray-100 text-gray-700 shadow-sm'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : i === 0 ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <TypingText text={msg.content} className="whitespace-pre-wrap" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                      <Bot size={14} className="text-[#2D2D2D]" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center gap-1">
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                      />
                      <span className="ml-2 text-xs text-gray-500 font-medium">Thinking…</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-100 shrink-0 space-y-2">
              <p className="text-[10px] text-center text-gray-400 leading-relaxed px-1">
                AI-generated guidance only. Not medical advice.
              </p>
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder='e.g. I have fever and cough…'
                  className="flex-1 bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#2D2D2D] transition-all outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 bg-[#2D2D2D] text-white rounded-xl flex items-center justify-center shadow-lg disabled:opacity-50"
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
