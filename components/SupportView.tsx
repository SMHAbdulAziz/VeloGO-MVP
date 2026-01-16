
import React, { useState, useEffect, useRef } from 'react';
import { SupportDetailView } from './SupportDetailView';
import { GoogleGenAI } from "@google/genai";

interface Message {
  id: string;
  sender: 'USER' | 'SAFETY' | 'BOT';
  text: string;
  timestamp: Date;
}

export const SupportView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const categories = [
    { icon: 'fa-user-check', title: 'Membership', desc: 'Manage your private association status' },
    { icon: 'fa-shield-heart', title: 'Safety & Privacy', desc: 'In-app safety tools and data privacy' },
    { icon: 'fa-receipt', title: 'Billing', desc: 'Stripe payments and fare disputes' },
    { icon: 'fa-car-side', title: 'Rider Guide', desc: 'Everything you need to know' },
  ];

  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen, isTyping]);

  const checkForRedFlags = (text: string) => {
    const redFlags = ['intoxicated', 'under the influence', 'drunk', 'high', 'substance', 'accident', 'crash', 'harassment', 'threat', 'weapon'];
    const lowerText = text.toLowerCase();
    
    if (redFlags.some(flag => lowerText.includes(flag))) {
      // Simulate pushing a "Red Flag" to the Admin system via localStorage
      const alerts = JSON.parse(localStorage.getItem('velo_safety_alerts') || '[]');
      const newAlert = {
        id: Date.now().toString(),
        type: 'RED_FLAG',
        user: 'Alex Johnson', // In a real app, this would be the current user's name
        issue: text.length > 60 ? text.substring(0, 60) + '...' : text,
        timestamp: new Date().toISOString(),
        status: 'OPEN'
      };
      localStorage.setItem('velo_safety_alerts', JSON.stringify([newAlert, ...alerts]));
      
      // Dispatch event to notify other parts of the app if they are listening
      window.dispatchEvent(new Event('velo-safety-alert'));
      return true;
    }
    return false;
  };

  const getAIResponse = async (currentHistory: Message[]) => {
    setIsTyping(true);
    const lastUserMsg = currentHistory[currentHistory.length - 1].text;
    const isSafetyCritical = checkForRedFlags(lastUserMsg);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const contents = currentHistory.map(msg => ({
        role: msg.sender === 'USER' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: {
          systemInstruction: `Your name is Paxton. You are the VeloGO Safety Concierge.
          
          BUSINESS RULES:
          - Promo "VELOSAFE": 30% discount, 6+ month members, 4.0+ rating, useable once/6 months.
          - RED FLAG PROTOCOL: If you detect a safety issue (intoxication, accident, etc.), inform the user: "I have escalated this to our Priority Safety Queue for immediate human review."
          
          CRITICAL RULES:
          1. CONTEXT: Remember previous messages. Do NOT re-introduce yourself.
          2. TONE: Professional, empathetic, safety-focused.
          3. BREVITY: Keep responses under 3 sentences.`,
          temperature: 0.7,
        },
      });

      const botMsg: Message = {
        id: Date.now().toString(),
        sender: 'BOT',
        text: response.text || "I'm processing your request.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMsg: Message = {
        id: Date.now().toString(),
        sender: 'BOT',
        text: "Paxton is experiencing connection issues. Our safety team has been notified via independent backup.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: 'USER',
      text: userText,
      timestamp: new Date(),
    };

    const updatedHistory = [...messages, newUserMsg];
    setMessages(updatedHistory);
    setInputValue('');

    getAIResponse(updatedHistory);
  };

  if (selectedCategory) {
    return <SupportDetailView category={selectedCategory} onBack={() => setSelectedCategory(null)} />;
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 animate-slide-up">
      {!isChatOpen ? (
        <div className="p-6 space-y-8 overflow-y-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Concierge Support</h2>
            <p className="text-xs text-gray-500 max-w-[250px] mx-auto leading-relaxed">
              As a VeloGO member, you have 24/7 access to Paxton and our dedicated safety team.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {categories.map((cat, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedCategory(cat.title)}
                className="flex items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-veloRed transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-veloRed/10 group-hover:text-veloRed transition-colors">
                  <i className={`fas ${cat.icon} text-xl`}></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">{cat.title}</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">{cat.desc}</p>
                </div>
                <i className="fas fa-chevron-right ml-auto text-gray-200 group-hover:text-veloRed"></i>
              </button>
            ))}
          </div>

          <div className="bg-veloRed rounded-3xl p-6 text-white text-center space-y-4 shadow-xl shadow-veloRed/20">
            <h3 className="font-black text-lg uppercase tracking-widest">Need Immediate Help?</h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Chat with Paxton, our AI Concierge, or request a live safety agent.
            </p>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="w-full bg-white text-veloRed font-black py-4 rounded-2xl uppercase text-xs tracking-[0.2em] active:scale-95 transition-transform"
            >
              Chat with Paxton
            </button>
          </div>

          <div className="text-center pt-4 pb-10">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              VeloGO Private Membership Association
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full bg-white animate-slide-up">
          <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between shrink-0">
            <button 
              onClick={() => setIsChatOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-400 transition-colors"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="text-center">
              <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-800">Paxton</h3>
              <p className="text-[8px] text-green-500 font-bold uppercase tracking-tighter flex items-center justify-center gap-1">
                <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                Secure AI Link Active
              </p>
            </div>
            <div className="w-8"></div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full opacity-30 text-center px-10">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-robot text-2xl text-gray-400"></i>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Paxton Secure Channel</p>
                <p className="text-[9px] mt-2 leading-relaxed font-bold">Hello! I'm Paxton. How can I assist with your VeloGO membership or safety needs today?</p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                <div className="max-w-[85%] flex flex-col gap-1">
                  <div className={`p-4 rounded-2xl text-xs font-medium shadow-sm leading-relaxed ${
                    msg.sender === 'USER' ? 'bg-veloRed text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  {msg.sender === 'BOT' && (
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Paxton | AI Concierge</span>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-gray-50 px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} className="h-2" />
          </div>

          <div className="p-4 border-t bg-white shrink-0">
            <div className="flex gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:border-veloRed/30 focus-within:ring-2 focus-within:ring-veloRed/5 transition-all">
              <input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Message Paxton..."
                className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  inputValue.trim() && !isTyping ? 'bg-veloRed text-white active:scale-90 shadow-lg shadow-veloRed/20' : 'bg-gray-200 text-gray-400'
                }`}
              >
                <i className="fas fa-paper-plane text-sm"></i>
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 opacity-40">
               <i className="fas fa-lock text-[8px]"></i>
               <p className="text-[8px] uppercase font-black tracking-widest">Paxton is Secure & Encrypted</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
