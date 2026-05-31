"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DrugSearch from '@/components/DrugSearch';
import InteractionChecker from '@/components/InteractionChecker';
import SymptomChecker from '@/components/SymptomChecker';
import NafdacVerifier from '@/components/NafdacVerifier';
import AiChatBox from '@/components/AiChatBox';
import { Search, ShieldAlert, HeartPulse, ShieldCheck, MessageSquare, ArrowRight } from 'lucide-react';

export default function Home() {
  const [currentTab, setCurrentTab] = useState('search');
  const [interactionChecklist, setInteractionChecklist] = useState<string[]>([]);
  const [keyChangeTrigger, setKeyChangeTrigger] = useState(0);

  const handleAddToInteractions = (drugName: string) => {
    setInteractionChecklist((prev) => [...prev, drugName]);
    setCurrentTab('interactions');
  };

  const handleClearChecklist = () => {
    setInteractionChecklist([]);
  };

  const handleKeyChange = () => {
    // Increment trigger to force re-render of components relying on API keys
    setKeyChangeTrigger((prev) => prev + 1);
  };

  const renderContent = () => {
    // Pass keyChangeTrigger as key to force component recreation when API key changes
    switch (currentTab) {
      case 'search':
        return <DrugSearch onAddToInteractions={handleAddToInteractions} />;
      case 'interactions':
        return (
          <InteractionChecker
            key={`interactions-${keyChangeTrigger}`}
            initialDrugList={interactionChecklist}
            onClearInitialList={handleClearChecklist}
          />
        );
      case 'symptoms':
        return <SymptomChecker key={`symptoms-${keyChangeTrigger}`} />;
      case 'nafdac':
        return <NafdacVerifier />;
      case 'chat':
        return <AiChatBox key={`chat-${keyChangeTrigger}`} />;
      default:
        return <DrugSearch onAddToInteractions={handleAddToInteractions} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} onKeyChange={handleKeyChange} />

      {/* Hero Welcome Panel (Only visible on initial search page and before user queries) */}
      {currentTab === 'search' && (
        <div className="w-full bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white py-12 px-4 border-b border-emerald-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-[10px] sm:text-xs font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-3.5 py-1.5 rounded-full uppercase tracking-widest inline-block animate-pulse-glow">
              🩺 Empowering Safe Self-Medication
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight">
              NaijaMed Checker
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
              Lookup local Nigerian drug brands, screen symptom warnings for Malaria or Typhoid, check drug combinations, and verify authenticity cards.
            </p>
          </div>
        </div>
      )}

      {/* Main Tab Render Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Info Cards (Only shown on search catalog page) */}
        {currentTab === 'search' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Checker Card */}
            <div 
              onClick={() => setCurrentTab('interactions')}
              className="group border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl p-5 cursor-pointer shadow-sm hover:border-emerald-500 transition-all duration-300 flex flex-col justify-between min-h-[140px]"
            >
              <div className="space-y-2">
                <div className="p-2 w-fit rounded-xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors">
                  Interaction Checker
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                  Combine 2+ drugs to search for dangerous combination alerts.
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5 pt-3 uppercase">
                Go Check <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Symptom Card */}
            <div 
              onClick={() => setCurrentTab('symptoms')}
              className="group border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl p-5 cursor-pointer shadow-sm hover:border-emerald-500 transition-all duration-300 flex flex-col justify-between min-h-[140px]"
            >
              <div className="space-y-2">
                <div className="p-2 w-fit rounded-xl bg-rose-500/10 text-rose-500 group-hover:bg-rose-50 group-hover:text-white transition-colors duration-300">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors">
                  Symptom Guide
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                  Screen symptoms locally for common conditions and find hospital red flags.
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5 pt-3 uppercase">
                Guide Triage <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* NAFDAC Card */}
            <div 
              onClick={() => setCurrentTab('nafdac')}
              className="group border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl p-5 cursor-pointer shadow-sm hover:border-emerald-500 transition-all duration-300 flex flex-col justify-between min-h-[140px]"
            >
              <div className="space-y-2">
                <div className="p-2 w-fit rounded-xl bg-teal-500/10 text-teal-500 group-hover:bg-teal-50 group-hover:text-white transition-colors duration-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors">
                  Verify NAFDAC Codes
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                  Learn to spot fake medicines using the MAS SMS scratch-off PIN codes.
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5 pt-3 uppercase">
                Verify MAS <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* AI Assistant Card */}
            <div 
              onClick={() => setCurrentTab('chat')}
              className="group border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl p-5 cursor-pointer shadow-sm hover:border-emerald-500 transition-all duration-300 flex flex-col justify-between min-h-[140px]"
            >
              <div className="space-y-2">
                <div className="p-2 w-fit rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors">
                  AI Health Companion
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                  Chat with a companion in Pidgin and English for safe dosage directions.
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5 pt-3 uppercase">
                Chat Helper <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        )}

        {/* Dynamic active view */}
        <div className="w-full pb-12">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
