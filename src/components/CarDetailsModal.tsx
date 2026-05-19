import React, { useState, useEffect, useRef } from "react";
import { Car, ChatMessage } from "../types";
import { X, Sparkles, Heart, User, Milestone, HelpCircle, Send, CheckCircle, RefreshCw } from "lucide-react";

interface CarDetailsModalProps {
  car: Car | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenFinanceCalculators: (carId: string) => void;
}

export default function CarDetailsModal({
  car,
  onClose,
  isSaved,
  onToggleSave,
  onOpenFinanceCalculators
}: CarDetailsModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loadingAgent, setLoadingAgent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (car) {
      // Clear and pre-populate chatbot history for that specific car
      setMessages([
        {
          sender: "agent",
          text: `Greetings. I am your personal virtual dealer advisor for this gorgeous ${car.year} ${car.brand} ${car.model}. How can I assist you with spec highlights, customization records, or financing calculation details today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [car]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loadingAgent]);

  if (!car) return null;

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoadingAgent(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          carContextId: car.id
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
      setLoadingAgent(false);
    }
  };

  const handlesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const PRESET_QUERIES = [
    "What is the engine output of this car?",
    "Calculate 7.5% purchase tax and total fee.",
    "Recommend standard competitive finance durations for this listing."
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto block p-4 font-sans flex items-center justify-center">
      {/* Background Dim */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Toolbar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="text-[#b87500] bg-[#ffddb8] px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider font-mono">SPEC SHEET</span>
            <h2 className="font-display font-extrabold text-[#131b2e] text-lg">{car.brand} {car.model} {car.trim}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body elements */}
        <div className="grid grid-cols-1 lg:grid-cols-12 h-[80vh] overflow-hidden">
          
          {/* Left Column: Spec Sheet Details (Scrollable) */}
          <div className="lg:col-span-7 overflow-y-auto p-5 space-y-6 border-r border-gray-100 hide-scrollbar">
            {/* Main Picture */}
            <div className="relative h-72 rounded-2xl overflow-hidden border border-gray-100">
              <img src={car.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
              <button
                onClick={() => onToggleSave(car.id)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center border shadow transition-all ${
                  isSaved ? "text-red-500 fill-red-500" : "text-gray-500 hover:text-red-500"
                }`}
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Core specs list */}
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <h3 className="font-display font-bold text-lg text-[#131b2e]">Performance & Core Attributes</h3>
                <span className="font-display font-extrabold text-2xl text-blue-600">${car.price.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                <div>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Production Year</span>
                  <span className="font-display font-extrabold text-[#131b2e] text-sm block mt-0.5">{car.year}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Odometer</span>
                  <span className="font-display font-extrabold text-[#131b2e] text-sm block mt-0.5">{car.mileage.toLocaleString()} mi</span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Transmission</span>
                  <span className="font-display font-extrabold text-[#131b2e] text-sm block mt-0.5">{car.transmission}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Fuel System</span>
                  <span className="font-display font-extrabold text-[#131b2e] text-sm block mt-0.5">{car.fuelType}</span>
                </div>
              </div>
            </div>

            {/* In depth mechanical specifications */}
            <div className="space-y-3">
              <h4 className="font-display font-bold text-sm text-[#131b2e] border-b pb-1.5 border-gray-100 flex items-center justify-between">
                <span>Technical Specifications</span>
                <span className="text-[10px] text-gray-400 font-mono">Precision Logged</span>
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Exterior Color</span>
                  <span className="font-semibold text-[#131b2e]">{car.color || "Sophisticated Finish"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Engine Layout</span>
                  <span className="font-semibold text-[#131b2e]">{car.engine || "Inline Turbocharged"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Output Horsepower</span>
                  <span className="font-semibold text-emerald-600">{car.horsepower || 250} HP</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Previous Owners</span>
                  <span className="font-semibold text-[#131b2e]">{car.owners || 1} Owner</span>
                </div>
              </div>
            </div>

            {/* Description block */}
            <div className="space-y-2">
              <h4 className="font-display font-bold text-sm text-[#131b2e]">Showroom Narrative</h4>
              <p className="text-xs text-gray-600 leading-relaxed font-sans bg-blue-50/10 p-4 rounded-2xl border border-gray-50/50">
                {car.description}
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-2">
              <button
                onClick={() => onOpenFinanceCalculators(car.id)}
                className="w-full py-3.5 bg-blue-600 text-white rounded-xl text-xs font-bold font-display hover:bg-blue-700 active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                Calculate Luxury Budget Plan & Pre-Approve
              </button>
            </div>
          </div>

          {/* Right Column: Virtual Showroom Chat Advisor (Flexible Layout) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-gray-50 h-full">
            <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-xs text-[#131b2e]">Virtual Spec Advisor</h4>
                  <p className="text-[9px] text-[#7c839b] font-mono leading-none">Powered by Gemini AI</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            {/* Message Area */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 hide-scrollbar">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    m.sender === "user" 
                      ? "bg-blue-600 text-white rounded-tr-none shadow-sm" 
                      : "bg-white text-gray-800 border rounded-tl-none shadow-xs"
                  }`}>
                    {m.text}
                    <span className="block text-[8px] font-mono text-right mt-1.5 opacity-60">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              {loadingAgent && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-400 border rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-2 shadow-xs">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    Analyzing listing specifications...
                  </div>
                </div>
              )}
            </div>

            {/* Preset Query Badges list */}
            <div className="px-4 py-2 bg-white/70 border-t border-gray-100 flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono">Suggested Inquiries</span>
              <div className="flex flex-col gap-1">
                {PRESET_QUERIES.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    disabled={loadingAgent}
                    className="text-left text-[11px] text-blue-600 bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100/30 transition-colors truncate font-medium disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input fields */}
            <form onSubmit={handlesSubmit} className="p-3 bg-white border-t border-gray-150 flex gap-2">
              <input
                type="text"
                placeholder={`Ask anything about this ${car.brand}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={loadingAgent}
                className="flex-1 bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 outline-none focus:bg-white focus:border-blue-600 transition-all font-sans"
              />
              <button 
                type="submit"
                disabled={loadingAgent || !inputText.trim()}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
