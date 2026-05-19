import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, RefreshCw, Bot, Minimize2 } from "lucide-react";
import { ChatMessage } from "../types";

interface VirtualAgentProps {
  onSelectCar: (carId: string) => void;
}

export default function VirtualAgent({ onSelectCar }: VirtualAgentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "agent",
      text: "Hello! I am Velocity's concierge assistant. Ask me to find specific cars (e.g., 'Find me a hybrid under $60,000'), calculate loan rates, or estimate a custom trade-in appraisal. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg]
        })
      });

      const data = await response.json();
      const agentMsg: ChatMessage = {
        sender: "agent",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const CONCIERGE_CHIPS = [
    "Recommend a car under $60,000",
    "Which cars are automatic hybrids?",
    "Show me German vehicles"
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 md:bottom-8 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 duration-200"
        id="virtual-agent-fab"
        title="Speak to Showroom Assistant"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </button>

      {/* Chat Terminal Drawer */}
      {isOpen && (
        <div 
          className="fixed bottom-36 md:bottom-24 right-4 md:right-8 w-[92%] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100 z-50 overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
          id="virtual-agent-drawer"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-[#ffddb8]" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-[#ffffff] text-xs leading-none">AutoTrade Concierge</h3>
                <span className="text-[9px] font-mono opacity-80 mt-1 block">Live Digital Showroom Agent</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded text-white/80 hover:text-white transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50 hide-scrollbar">
            {messages.map((m, index) => (
              <div key={index} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none shadow-sm"
                    : "bg-white text-gray-800 border rounded-tl-none shadow-xs"
                }`}>
                  {/* Inline text rendering containing markdown-like formatting */}
                  <div className="space-y-1">
                    {m.text.split("\n\n").map((para, pIdx) => {
                      if (para.startsWith("- ") || para.startsWith("* ")) {
                        return (
                          <ul key={pIdx} className="list-disc pl-4 space-y-1">
                            {para.split("\n").map((li, lIdx) => (
                              <li key={lIdx}>
                                {li.replace(/^[\s-*]+/, "")}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={pIdx}>{para}</p>;
                    })}
                  </div>
                  <span className="block text-[8px] font-mono text-right mt-1.5 opacity-60">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-400 border rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-2 shadow-xs">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  Querying showroom directories...
                </div>
              </div>
            )}
          </div>

          {/* Quick recommendations suggestions */}
          <div className="p-3 bg-white border-t border-gray-100 flex flex-col gap-1.5">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono">Suggested Inquiries</span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
              {CONCIERGE_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  disabled={loading}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 break-keep whitespace-nowrap text-blue-600 rounded-full text-[10px] font-semibold border border-blue-100/40 transition-all flex-shrink-0 disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Form write input */}
          <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              className="flex-grow bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 outline-none focus:bg-white focus:border-blue-600 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl transition-all font-semibold active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
