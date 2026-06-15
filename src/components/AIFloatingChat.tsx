import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIFloatingChatProps {
  onStartAdvisor: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function AIFloatingChat({ onStartAdvisor, isOpen, onToggle }: AIFloatingChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Star AI 👋\n\nI can help you find your ideal health insurance, explain pre-existing waiting periods, check cashless hospital rates, or compare coverages head-to-head. How can I protect you and your family today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const SUGGESTED_PROMPTS = [
    "Is diabetes covered from Day-1?",
    "Compare Comprehensive vs Family Delite?",
    "What is the average claim approval time?",
    "Tell me about Senior citizen red carpet."
  ];

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Send message history to the backend endpoint /api/chat
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg]
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        throw new Error("Chat request failed");
      }
    } catch (err) {
      console.warn("Fallback expert advisor response used");
      // Fallback answers based on keywords
      const query = text.toLowerCase();
      let reply = "Regarding Star Health Insurance, our Star Comprehensive Plus is an exceptional premium choice covering all cashless charges, maternity, and single-room costs without capping. Diabetes patients can enroll directly in the Star Diabetes Safe Specialty with immediate day-1 security cover. How can I help you check nearby hospital rates or cashless processing today?";
      
      if (query.includes("diabetes") || query.includes("sugar")) {
        reply = "Yes! Star Diabetes Safe offers immediate coverage starting from Day-1 specifically for diabetes-related complications, skip the standard 3-year pre-existing wait timeline. Regular insulin pump alignments and HbA1c clinics are covered!";
      } else if (query.includes("waiting") || query.includes("ped")) {
        reply = "Standard waiting periods are 36 Months for general pre-existing diseases under Star Comprehensive Plus. However, specialised senior policies reduce this to 12 Months (with co-pay conditions), and Diabetes Safe covers diabetes immediate from day-1.";
      } else if (query.includes("pregnant") || query.includes("pregnancy") || query.includes("maternity")) {
        reply = "Yes, Star Comprehensive Plus includes absolute gold standard maternity coverage up to ₹1,00,000 for private rooms, complete delivery fees, pediatric vaccination support, and instantaneous newborn baby insurance cover from their first breath.";
      } else if (query.includes("compare")) {
        reply = "Star Comprehensive Plus offers unmitigated premium coverage (completely private AC rooms, ₹1 Cr sum sizes) with zero rent capping. Star Family Delite is our highly affordable budget-friendly matching alternative with shared allocations.";
      } else if (query.includes("claim") || query.includes("hospital")) {
        reply = "Our targeted cashless claims are settled directly with 14,000+ Indian network medical hubs. Simply present your digital ID card, and our dedicated medical desks pre-approve authorizations under 2 Hours.";
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      }, 700);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-chat-floating-container" className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Clarity Invite speech bubble for easy policy clarity guidance */}
      {!isOpen && (
        <div className="absolute bottom-18 right-0 mb-2 w-48 bg-slate-900 text-white text-[10px] font-bold p-3 rounded-2xl shadow-xl border border-slate-750 pointer-events-none animate-bounce">
          <div className="relative text-center">
            <span className="block text-amber-300">💡 Get Policy Clarity</span>
            <span className="block text-slate-300 text-[9px] mt-0.5">Click to chat with Star AI!</span>
            {/* Arrow down pointer */}
            <div className="absolute -bottom-5 right-6 w-2.5 h-2.5 bg-slate-900 rotate-45 border-r border-b border-slate-750" />
          </div>
        </div>
      )}

      {/* Floating Sparkles Circular toggle button with notification ripple and custom blinking halo */}
      <button
        onClick={onToggle}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white bg-star-red shadow-xl hover:scale-105 transition-all duration-300 relative border border-red-700 cursor-pointer ${
          isOpen 
            ? 'rotate-90 bg-slate-900 border-slate-700' 
            : 'animate-bot-glow bg-star-red'
        }`}
      >
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00338D] text-[8px] text-white flex items-center justify-center font-bold animate-pulse">1</span>
          </span>
        )}
        {isOpen ? <X className="w-5 h-5 text-white" /> : <MessageSquare className="w-6 h-6 text-white" />}
      </button>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-16 right-0 w-[360px] sm:w-[410px] h-[550px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden text-left"
          >
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-250/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-xl bg-star-blue text-white flex items-center justify-center text-sm shadow-md font-bold">
                  🌟
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-905 flex items-center gap-1.5 text-left">
                    <span>Star AI Expert</span>
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </h4>
                  <div className="text-[10px] text-star-red font-extrabold uppercase tracking-wider">Licensed Health advisor</div>
                </div>
              </div>
              <button 
                onClick={onToggle}
                className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 rounded cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white shadow-inner">
              
              {messages.map((m, idx) => (
                <div 
                  key={idx}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-4 rounded-2xl max-w-[85%] text-xs shadow-inner text-left font-medium ${
                    m.role === 'user'
                      ? 'bg-star-blue text-white border border-blue-900'
                      : 'bg-slate-50 border border-slate-200/60 text-slate-700 leading-relaxed whitespace-pre-line'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}

              {/* Typing Loader Indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-2 text-xs text-slate-550 font-semibold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-star-blue" />
                    <span>Star AI is typing customized advice...</span>
                  </div>
                </div>
              )}
              
              <div ref={bottomRef} />
            </div>

            {/* Quick Suggestion buttons */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 pt-1 border-t border-slate-200 bg-slate-50 text-left">
                <div className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest mb-1.5 px-1">FAQ Quick Start:</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {SUGGESTED_PROMPTS.map(pr => (
                    <button
                      key={pr}
                      onClick={() => handleSendMessage(pr)}
                      className="text-left text-[10px] font-bold p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition shadow-sm cursor-pointer"
                    >
                      {pr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Form input */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col gap-2">
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage(input);
                  }}
                  placeholder="Ask about pregnancy, room rent capping, waiting list..."
                  className="flex-1 bg-white border border-slate-250 focus:border-star-red focus:outline-none rounded-xl px-4 py-3 placeholder-slate-400 text-xs font-semibold text-slate-900 shadow-inner"
                />
                <button
                  onClick={() => handleSendMessage(input)}
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-star-red hover:bg-red-700 text-white flex items-center justify-center transition shadow-md cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Redirect to onboarding wizard button */}
              <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1.5 border-t border-slate-200 mt-1">
                <span>Want to see matching premiums?</span>
                <button 
                  onClick={() => {
                    onToggle();
                    onStartAdvisor();
                  }}
                  className="font-black text-star-red hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Launch Advisor Onboarding →</span>
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
