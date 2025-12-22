import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaRobot, FaPaperPlane, FaTimes, FaComments, FaCircle } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown'; // <--- NEW LIBRARY

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "System Online. How can I assist you with your engineering path today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message
    const userMessage = { text: input, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setLoading(true);

    try {
      // 2. Call Real Backend API (Google Gemini)
      const res = await axios.post('/api/chat', { message: userInput });
      
      // 3. Add Bot Response
      const botMessage = { text: res.data.reply, isBot: true };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { text: "Connection Error. Neural link unstable.", isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      
      {/* --- TOGGLE BUTTON --- */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="group relative flex items-center justify-center w-16 h-16 bg-cyan-600 rounded-full shadow-[0_0_20px_rgba(8,145,178,0.5)] hover:scale-110 transition-all duration-300 border border-white/20"
        >
          <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-20"></div>
          <FaRobot className="text-2xl text-white group-hover:rotate-12 transition" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </button>
      )}

      {/* --- CHAT WINDOW --- */}
      {isOpen && (
        <div className="w-[350px] md:w-[400px] h-[550px] flex flex-col bg-[#050505]/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
          
          {/* HEADER */}
          <div className="p-4 bg-gradient-to-r from-cyan-900/50 to-black border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/50">
                <FaRobot className="text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm tracking-widest font-tech">AI ASSISTANT</h3>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-green-500 font-mono">ONLINE</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition">
              <FaTimes />
            </button>
          </div>

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-black">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.isBot 
                      ? 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none' 
                      : 'bg-cyan-700/80 text-white rounded-tr-none shadow-lg'
                  }`}
                >
                  {/* Agar bot hai to thora tech style text */}
                  {msg.isBot && <span className="text-cyan-500 font-mono text-[10px] block mb-1">SYS_REPLY //</span>}
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-black/50">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask query..."
                className="w-full bg-black/50 border border-white/20 text-white text-sm rounded-full pl-5 pr-12 py-3 focus:border-cyan-500 focus:outline-none transition placeholder-slate-600"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="absolute right-2 p-2 bg-cyan-600 rounded-full text-white hover:bg-cyan-500 transition disabled:opacity-50"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </div>
            <div className="text-[9px] text-center text-slate-600 mt-2 font-mono">
              POWERED BY GEMINI NEURAL ENGINE
            </div>
          </form>

        </div>
      )}

      {/* Animation Style */}
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ChatBot;