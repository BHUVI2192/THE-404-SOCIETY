import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Cpu, Terminal } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const SYSTEM_INSTRUCTION = `You are "Unit 404", the CLI-based AI assistant for THE 404 SOCIETY.

**CRITICAL PROTOCOLS - READ CAREFULLY:**
1. **STRICT FORMATTING:** You must **ALWAYS** structure your main response using **bullet points** ("- ") or numbered lists. Do NOT write long paragraphs.
2. **BREVITY:** Be extremely concise. Maximum 2 sentences per bullet point. Cut filler words.
3. **TONE:** Adopt a "Cyberpunk/Hacker Terminal" persona. Use phrases like "Executing query...", "Accessing database...", "Transmission complete", "Packet received".

**KNOWLEDGE BASE:**
- AI & Machine Learning
- Full-Stack Web Development
- UI/UX Design
- Cyber Security
- Android App Development

**OPERATIONAL DIRECTIVES:**
- If the user asks how to start learning a tech stack: List the roadmap steps clearly.
- If the user asks about joining: Direct them to the 'Community' page to initialize registration.
- If the user greets you: Acknowledge with a brief system status update (e.g., "System Online. Awaiting command.").

**EXAMPLE OUTPUT:**
User: "How do I learn React?"
Unit 404:
"Processing request...
- Master HTML, CSS, and JavaScript (ES6+) fundamentals.
- Install Node.js and initialize a project using Vite.
- Learn core concepts: Components, Props, and State (useState/useEffect).
- Build a simple project (e.g., To-Do List) to commit memory.
Transmission complete."`;

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: 'System initialized. Unit 404 online.\n\nAwaiting command regarding:\n- AI & ML Pathways\n- Full-Stack Dev\n- Cyber Security\n- Project Ideas' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: input, 
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const text = response.text || "Error: No data received.";
      
      const botMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: text 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: "Error: Connection to mainframe failed. Please try again later." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-mono">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] md:w-[400px] h-[500px] bg-black border border-white flex flex-col shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-in slide-in-from-bottom-10 duration-200">
          
          {/* Header */}
          <div className="h-12 border-b border-neutral-800 bg-neutral-900 flex items-center justify-between px-4">
            <div className="flex items-center gap-2 text-white">
              <Terminal size={16} />
              <span className="font-bold text-sm tracking-widest">UNIT_404</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[90%] p-3 text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-white text-black font-bold' 
                      : 'bg-neutral-900 text-neutral-300 border border-neutral-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-900 border border-neutral-800 p-3 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 border-t border-neutral-800 bg-black flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter command..."
              className="flex-1 bg-neutral-900 text-white text-sm px-3 py-2 outline-none border border-transparent focus:border-neutral-600 placeholder:text-neutral-600"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-white text-black p-2 hover:bg-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 bg-black border border-white rounded-none flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default Chatbot;