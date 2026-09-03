import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

const PRODUCT_BASE_URL = import.meta.env.VITE_PRODUCT_API_URL || 'http://localhost:8083';

const SUGGESTED_QUESTIONS = [
  'Show me shoes under $300',
  "What's new in stock?",
  'Any accessories on offer?',
];

export default function AssistantChat() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: "Hi! I'm ShopZone's shopping assistant. Ask me about our products — for example:",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, loading]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', text: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${PRODUCT_BASE_URL}/api/assistant/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: "Sorry, I couldn't reach the assistant right now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleContactClick = () => {
    setIsOpen(false);
    navigate('/contact');
  };

  const showSuggestions = messages.length === 1;

  return (
    <div className="fixed bottom-5 right-4 sm:right-5 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="mb-3 w-[calc(100vw-2rem)] max-w-[380px] h-[70vh] max-h-[520px] bg-white rounded-3xl shadow-2xl border border-amber-200/70 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-amber-950 via-amber-900 to-stone-900 text-amber-50 px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black leading-tight truncate">ShopZone Assistant</p>
                  <p className="text-[10px] text-amber-300/70">Online &middot; Ask me anything</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleContactClick}
                  title="Contact human support"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-200/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-200/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF8F3]">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-amber-950 text-amber-50 rounded-br-sm'
                        : 'bg-white border border-amber-200 text-stone-800 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-amber-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-amber-700/60"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {showSuggestions && !loading && (
                <div className="flex flex-col gap-2 pt-1">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <div
                      key={q}
                      className="text-left text-[11px] font-semibold text-amber-900/70 bg-amber-50/70 border border-amber-200/70 rounded-xl px-3.5 py-2.5"
                    >
                      &ldquo;{q}&rdquo;
                    </div>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-amber-200/60 bg-white flex items-center gap-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about products..."
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-amber-200 bg-[#FAF8F3] text-xs font-medium outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 disabled:opacity-60"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="p-2.5 rounded-xl bg-amber-950 text-amber-50 hover:bg-amber-900 disabled:opacity-40 transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-900 to-amber-950 text-amber-50 shadow-xl flex items-center justify-center hover:shadow-2xl transition-shadow"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}