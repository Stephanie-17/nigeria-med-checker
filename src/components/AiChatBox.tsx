"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, RefreshCw, MessageSquare, Key, ShieldAlert, Bot } from 'lucide-react';
import { hasGeminiKey, chatWithAi } from '@/lib/gemini';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export default function AiChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiEnabled, setIsAiEnabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const keyActive = hasGeminiKey();
    setIsAiEnabled(keyActive);
    
    if (keyActive && messages.length === 0) {
      setMessages([
        {
          role: 'model',
          text: "Bawoni! I am your NaijaMed AI companion. Ask me any questions about medications, side effects, active ingredients, or typical dosage guidelines. \n\nI can explain things in plain English or friendly Nigerian Pidgin. How fit I help you today?\n\n*Note: I am an AI, not a doctor. Always double check with a professional.*"
        }
      ]);
    }
  }, []);

  useEffect(() => {
    // Scroll chat to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const conversationStarters = [
    { label: "Can I drink alcohol with Flagyl?", text: "Why is it dangerous to drink alcohol while taking Flagyl?" },
    { label: "What is Felvin (Piroxicam) dangerous for?", text: "What is Felvin used for in Nigeria, and why is it dangerous for the stomach?" },
    { label: "Explain malaria dosage in Pidgin", text: "Explain how to take Artemether + Lumefantrine (malaria drug) in simple Pidgin English." }
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setErrorMsg(null);
    const newMsg: ChatMessage = { role: 'user', text: textToSend };
    const nextMessages = [...messages, newMsg];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    // Format history for Gemini API
    const historyPayload = nextMessages.slice(0, -1).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    try {
      const response = await chatWithAi(historyPayload, textToSend);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Failed to get AI response. Please verify your API Key and connection.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAiEnabled) {
    return (
      <div className="max-w-2xl mx-auto glass-card rounded-3xl p-8 text-center space-y-6 animate-slide-in">
        <div className="h-16 w-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto animate-pulse-glow">
          <Bot className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            Unlock AI Health Companion
          </h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed max-w-md mx-auto">
            The AI Health Companion uses Gemini 2.5 Flash to answer drug, dosage, and medical questions in plain English or local Pidgin. 
            To activate this feature, configure a Gemini API key.
          </p>
        </div>

        {/* Informative instructions */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-left text-xs sm:text-sm space-y-3">
          <h4 className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
            <Key className="h-4.5 w-4.5 text-emerald-500" />
            How to configure your API key:
          </h4>
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-650 dark:text-zinc-400 font-medium">
            <li>Click the <strong>Settings Gear</strong> icon at the top right of the navbar.</li>
            <li>Paste your Google Gemini API Key into the input box.</li>
            <li>Click <strong>Save API Key</strong>.</li>
            <li>The page will automatically refresh and unlock your AI chat health assistant!</li>
          </ol>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-amber-500 font-semibold">
          <ShieldAlert className="h-4 w-4" />
          <span>Your key is saved locally in your own browser storage. We do not store or track it.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto h-[600px] flex flex-col glass-card rounded-3xl overflow-hidden shadow-2xl animate-slide-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/10">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-white leading-tight">
              AI Health Companion
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mt-0.5">
              Active Gemini Helper
            </span>
          </div>
        </div>
        
        <div className="p-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-3 py-1 flex items-center gap-1">
          <Bot className="h-3.5 w-3.5" />
          NaijaMed Bot
        </div>
      </div>

      {/* Message logs area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/10 scrollbar-thin">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* Avatar indicator */}
            <div className={`p-1.5 rounded-lg flex-shrink-0 text-white ${
              msg.role === 'user' ? 'bg-emerald-600' : 'bg-slate-700'
            }`}>
              <MessageSquare className="h-4 w-4" />
            </div>

            {/* Bubble */}
            <div
              className={`rounded-2xl p-4 text-xs sm:text-sm shadow-sm whitespace-pre-line leading-relaxed font-medium ${
                msg.role === 'user'
                  ? 'bg-emerald-500 text-white rounded-tr-none'
                  : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 max-w-[85%]">
            <div className="p-1.5 rounded-lg bg-slate-700 text-white">
              <RefreshCw className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-400 text-xs sm:text-sm font-medium flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-500" />
              <span>NaijaMed companion is thinking...</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 border border-rose-200 dark:border-rose-900/30 bg-rose-500/5 text-rose-600 dark:text-rose-400 text-xs rounded-xl text-center font-bold">
            ⚠️ {errorMsg}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starters (Only shows if there's only 1 greeting message) */}
      {messages.length === 1 && !isLoading && (
        <div className="px-6 py-3 border-t border-slate-200/50 dark:border-zinc-800/50 bg-white/20 dark:bg-zinc-950/20 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">
            Suggested Questions
          </span>
          <div className="flex flex-wrap gap-2">
            {conversationStarters.map((starter, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(starter.text)}
                className="text-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-emerald-500 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 font-semibold transition-colors text-left"
              >
                {starter.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Type your health or medication question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Send className="h-4 w-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
