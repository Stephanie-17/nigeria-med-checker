"use client";

import React, { useState, useEffect } from 'react';
import { Stethoscope, Settings, Moon, Sun, CheckCircle, HelpCircle, X } from 'lucide-react';
import { saveGeminiKey, getGeminiKey, removeGeminiKey, hasGeminiKey } from '@/lib/gemini';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onKeyChange: () => void;
}

export default function Navbar({ currentTab, setCurrentTab, onKeyChange }: NavbarProps) {
  const [isDark, setIsDark] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isKeySaved, setIsKeySaved] = useState(false);

  // Initialize theme and API key check
  useEffect(() => {
    // Check local storage / media query for dark mode
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkStored = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && systemTheme);
    setIsDark(isDarkStored);
    if (isDarkStored) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Get API Key if saved
    const savedKey = getGeminiKey();
    if (savedKey) {
      setApiKeyInput(savedKey);
      setIsKeySaved(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      saveGeminiKey(apiKeyInput);
      setIsKeySaved(true);
      setIsSettingsOpen(false);
      onKeyChange();
    }
  };

  const handleClearKey = () => {
    removeGeminiKey();
    setApiKeyInput('');
    setIsKeySaved(false);
    onKeyChange();
  };

  const navItems = [
    { id: 'search', label: 'Search Drugs' },
    { id: 'interactions', label: 'Check Interactions' },
    { id: 'symptoms', label: 'Symptom Guide' },
    { id: 'nafdac', label: 'Verify NAFDAC' },
    { id: 'chat', label: 'AI Health Companion' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab('search')}>
              <div className="p-2 rounded-xl bg-emerald-500 text-white animate-pulse-glow">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  NaijaMed
                </span>
                <span className="text-xs font-semibold block text-slate-500 dark:text-zinc-400 leading-none">
                  Checker
                </span>
              </div>
            </div>

            {/* Navigation tabs for tablet/desktop */}
            <nav className="hidden md:flex space-x-1 lg:space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentTab === item.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Utility buttons */}
            <div className="flex items-center gap-3">
              {/* AI Key Status Badge */}
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  isKeySaved 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                }`}
              >
                {isKeySaved ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    AI Active
                  </>
                ) : (
                  <>
                    <HelpCircle className="h-3 w-3" />
                    Local Mode
                  </>
                )}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
                title="Toggle Dark Mode"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Settings Toggle */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
                title="Open Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation tabs (always visible at bottom or just header scrollable) */}
        <div className="flex md:hidden overflow-x-auto border-t border-slate-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 px-2 py-1.5 gap-1 scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === item.id
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl border border-slate-100 dark:border-zinc-800 animate-slide-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-emerald-500" />
                NaijaMed Settings
              </h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                  Advanced AI Integration (Optional)
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Enter your Google Gemini API Key to enable localized medical chat, Pidgin English drug translation, and smart symptom sifting. Your key remains private and is only stored in your browser's local storage.
                </p>
              </div>

              <form onSubmit={handleSaveKey} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase mb-1.5">
                    Gemini API Key
                  </label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    disabled={isKeySaved}
                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-slate-800 dark:text-zinc-100"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  {isKeySaved ? (
                    <button
                      type="button"
                      onClick={handleClearKey}
                      className="w-full py-2.5 px-4 rounded-xl text-sm font-medium border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                    >
                      Remove Saved API Key
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsSettingsOpen(false)}
                        className="w-1/2 py-2.5 px-4 rounded-xl text-sm font-medium border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!apiKeyInput.trim()}
                        className="w-1/2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all"
                      >
                        Save API Key
                      </button>
                    </>
                  )}
                </div>
              </form>

              <div className="border-t border-slate-100 dark:border-zinc-800 pt-4">
                <span className="text-xs block text-slate-500 dark:text-zinc-400">
                  💡 Don't have a key? You can get a free one from the Google AI Studio console. Otherwise, the app works perfectly fine in <strong>Local Mode</strong> using built-in rules and NIH databases.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
