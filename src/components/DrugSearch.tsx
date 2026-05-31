"use client";

import React, { useState, useEffect } from 'react';
import { Search, Info, ShieldAlert, Award, FileText, Check, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { lookupDrug, NIGERIAN_DRUGS_DATABASE, DrugInfo } from '@/data/nigerianBrands';
import { fetchOpenFdaInfo, OpenFdaData } from '@/lib/medicalApi';

interface DrugSearchProps {
  onAddToInteractions: (drugName: string) => void;
}

export default function DrugSearch({ onAddToInteractions }: DrugSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<DrugInfo[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<DrugInfo | null>(null);
  const [openFdaData, setOpenFdaData] = useState<OpenFdaData | null>(null);
  const [isOpenFdaLoading, setIsOpenFdaLoading] = useState(false);
  const [customSearchError, setCustomSearchError] = useState(false);
  const [addedMessage, setAddedMessage] = useState(false);

  // Handle autocomplete matching
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const clean = query.trim().toLowerCase();
    
    // Suggest items matching name, genericName, or brand names
    const filtered = NIGERIAN_DRUGS_DATABASE.filter(d => 
      d.name.toLowerCase().includes(clean) ||
      d.genericName.toLowerCase().includes(clean) ||
      d.localBrands.some(b => b.toLowerCase().includes(clean))
    ).slice(0, 5);

    setSuggestions(filtered);
  }, [query]);

  const handleSelectDrug = (drug: DrugInfo) => {
    setSelectedDrug(drug);
    setQuery('');
    setSuggestions([]);
    setOpenFdaData(null);
    setCustomSearchError(false);
    
    // Fetch OpenFDA data as background fallback/supplement
    fetchOnlineData(drug.rxNormQuery || drug.genericName);
  };

  const handleCustomSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const localMatch = lookupDrug(query);
    if (localMatch) {
      handleSelectDrug(localMatch);
      return;
    }

    // Try online search for the raw query directly (User typed something not in database)
    setSelectedDrug(null);
    setIsOpenFdaLoading(true);
    setCustomSearchError(false);
    
    try {
      const onlineInfo = await fetchOpenFdaInfo(query);
      if (onlineInfo) {
        setOpenFdaData(onlineInfo);
      } else {
        setCustomSearchError(true);
      }
    } catch (err) {
      setCustomSearchError(true);
    } finally {
      setIsOpenFdaLoading(false);
    }
  };

  const fetchOnlineData = async (name: string) => {
    setIsOpenFdaLoading(true);
    try {
      const info = await fetchOpenFdaInfo(name);
      if (info) {
        setOpenFdaData(info);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsOpenFdaLoading(false);
    }
  };

  const handleAddAction = (drugName: string) => {
    onAddToInteractions(drugName);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-in">
      {/* Title block */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
          Search Local & Generic Drugs
        </h2>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Find brand equivalents (like <strong className="text-emerald-500">Panadol</strong>, <strong className="text-emerald-500">Felvin</strong>, or <strong className="text-emerald-500">Coartem</strong>) and see safety guides.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <form onSubmit={handleCustomSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Enter brand name (e.g., Felvin) or active ingredient (e.g., Paracetamol)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-12 pr-4 py-3.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 shadow-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-500/20 transition-all text-sm sm:text-base"
          >
            Search
          </button>
        </form>

        {/* Predictive Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 z-30 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800 animate-slide-in">
            {suggestions.map((drug) => (
              <button
                key={drug.id}
                onClick={() => handleSelectDrug(drug)}
                className="w-full text-left px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-800 dark:text-zinc-100">
                    {drug.name}
                  </span>
                  {drug.type === 'brand' && (
                    <span className="text-xs text-slate-500 dark:text-zinc-400">
                      Brand of {drug.genericName}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 font-medium text-slate-600 dark:text-zinc-400">
                    {drug.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isOpenFdaLoading && !selectedDrug && (
        <div className="flex items-center justify-center p-12 text-slate-500 dark:text-zinc-400 gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Searching online FDA databases...</span>
        </div>
      )}

      {/* Main Results View */}
      {selectedDrug && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in">
          {/* Main info card */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {selectedDrug.name}
                  </h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                    selectedDrug.type === 'brand' 
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {selectedDrug.type} MEDICATION
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1.5">
                  Category: <strong className="text-slate-700 dark:text-zinc-300">{selectedDrug.category}</strong>
                </p>
                {selectedDrug.type === 'brand' && (
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                    Active Ingredient: <strong className="text-slate-800 dark:text-zinc-200 underline decoration-emerald-500/50">{selectedDrug.genericName}</strong>
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleAddAction(selectedDrug.name)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-500/10"
                >
                  {addedMessage ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {addedMessage ? 'Added to List!' : 'Check Interactions'}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-emerald-500" />
                What it is
              </h4>
              <p className="text-slate-700 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
                {selectedDrug.description}
              </p>
            </div>

            {/* Local Brand Matchers */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-emerald-500" />
                Common Nigerian Brands
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedDrug.localBrands.map((brand) => (
                  <span
                    key={brand}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            {/* Usage & Dose */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-zinc-900/30 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800">
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Primary Usage
                </h5>
                <p className="text-slate-700 dark:text-zinc-300 text-sm">
                  {selectedDrug.usage}
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Standard Safe Dosage (Adult)
                </h5>
                <p className="text-slate-700 dark:text-zinc-300 text-sm">
                  {selectedDrug.dosage}
                </p>
              </div>
            </div>

            {/* Side Effects */}
            <div className="space-y-2">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Possible Side Effects
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600 dark:text-zinc-300">
                {selectedDrug.sideEffects.map((effect, idx) => (
                  <li key={idx}>{effect}</li>
                ))}
              </ul>
            </div>

            {/* Pidgin Translation (Local Context) */}
            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 space-y-2.5">
              <h4 className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Pharmacist Advice (in Pidgin)
              </h4>
              <p className="text-emerald-950 dark:text-emerald-200 font-medium italic text-sm sm:text-base leading-relaxed">
                💬 &ldquo;{selectedDrug.pidginAdvice}&rdquo;
              </p>
            </div>
          </div>

          {/* Sidebar / Warnings */}
          <div className="space-y-6">
            {/* Core warnings */}
            <div className="rounded-3xl border border-rose-200 dark:border-rose-950/40 bg-rose-500/5 dark:bg-rose-500/10 p-5 space-y-4">
              <h4 className="font-extrabold text-rose-700 dark:text-rose-400 flex items-center gap-2 text-sm uppercase tracking-wider">
                <ShieldAlert className="h-5 w-5 text-rose-500 animate-pulse-glow rounded-full" />
                Precautions & Warnings
              </h4>
              <div className="space-y-3">
                {selectedDrug.warnings.map((warning, idx) => (
                  <div key={idx} className="flex gap-2.5 text-xs sm:text-sm text-rose-950 dark:text-rose-300">
                    <span className="font-bold text-rose-600 dark:text-rose-400">{idx + 1}.</span>
                    <p className="leading-relaxed font-medium">{warning}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* OpenFDA Fallback View */}
            {openFdaData && (
              <div className="glass-card rounded-3xl p-5 space-y-4">
                <h4 className="font-extrabold text-slate-800 dark:text-white flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider">
                  <FileText className="h-4.5 w-4.5 text-emerald-500" />
                  FDA Info (US Database)
                </h4>
                <div className="space-y-3 divide-y divide-slate-100 dark:divide-zinc-800 text-xs text-slate-600 dark:text-zinc-400">
                  {openFdaData.purpose && (
                    <div className="pb-2.5">
                      <span className="font-bold block text-slate-700 dark:text-zinc-300">Purpose:</span>
                      <p className="mt-1 line-clamp-3 hover:line-clamp-none transition-all">{openFdaData.purpose}</p>
                    </div>
                  )}
                  {openFdaData.indications && (
                    <div className="pt-2.5 pb-2.5">
                      <span className="font-bold block text-slate-700 dark:text-zinc-300">Indications:</span>
                      <p className="mt-1 line-clamp-3 hover:line-clamp-none transition-all">{openFdaData.indications}</p>
                    </div>
                  )}
                  {openFdaData.dosage && (
                    <div className="pt-2.5">
                      <span className="font-bold block text-slate-700 dark:text-zinc-300">FDA Dosage Info:</span>
                      <p className="mt-1 line-clamp-3 hover:line-clamp-none transition-all">{openFdaData.dosage}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Online FDA Data only (If not matched in local db, custom search result) */}
      {!selectedDrug && openFdaData && (
        <div className="glass-card rounded-3xl p-6 space-y-6 max-w-2xl mx-auto animate-slide-in">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                  {openFdaData.brandName || openFdaData.genericName || query}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                  Online Result
                </span>
              </div>
              {openFdaData.genericName && (
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                  Generic: <strong>{openFdaData.genericName}</strong>
                </p>
              )}
            </div>

            <button
              onClick={() => handleAddAction(openFdaData.brandName || openFdaData.genericName || query)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all"
            >
              {addedMessage ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {addedMessage ? 'Added!' : 'Check Interactions'}
            </button>
          </div>

          <div className="space-y-4">
            {openFdaData.purpose && (
              <div className="space-y-1">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Purpose</h5>
                <p className="text-sm text-slate-700 dark:text-zinc-300">{openFdaData.purpose}</p>
              </div>
            )}

            {openFdaData.indications && (
              <div className="space-y-1">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Indications / Usage</h5>
                <p className="text-sm text-slate-700 dark:text-zinc-300">{openFdaData.indications}</p>
              </div>
            )}

            {openFdaData.dosage && (
              <div className="space-y-1">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Administration & Dosage</h5>
                <p className="text-sm text-slate-700 dark:text-zinc-300">{openFdaData.dosage}</p>
              </div>
            )}

            {openFdaData.warnings && (
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-500/5 text-amber-950 dark:text-amber-300 text-xs sm:text-sm space-y-1.5">
                <h5 className="font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Warnings</h5>
                <p className="leading-relaxed font-medium">{openFdaData.warnings}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Error */}
      {customSearchError && (
        <div className="max-w-md mx-auto p-6 border border-amber-200 dark:border-amber-900/30 bg-amber-500/5 rounded-3xl text-center space-y-4 animate-slide-in">
          <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
          <div>
            <h4 className="font-bold text-slate-800 dark:text-zinc-100">Drug Not Found</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              We couldn't find &ldquo;{query}&rdquo; in our local brand index or the FDA database. Check spelling or try searching generic names (e.g. Paracetamol, Ibuprofen).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
