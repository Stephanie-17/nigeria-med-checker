"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, ShieldAlert, CheckCircle, RefreshCw, AlertTriangle, Sparkles, MessageCircleWarning } from 'lucide-react';
import { lookupDrug, NIGERIAN_DRUGS_DATABASE, DrugInfo } from '@/data/nigerianBrands';
import { fetchRxCuisForDrug, fetchDrugInteractions, InteractionResult } from '@/lib/medicalApi';
import { hasGeminiKey, explainInteractionWithAi } from '@/lib/gemini';

interface InteractionCheckerProps {
  initialDrugList: string[];
  onClearInitialList: () => void;
}

interface AiExplanationMap {
  [key: string]: {
    text: string;
    loading: boolean;
    error: boolean;
  };
}

interface ExtendedInteractionResult extends Omit<InteractionResult, 'drugA' | 'drugB'> {
  drugA: InteractionResult['drugA'] & { displayName: string };
  drugB: InteractionResult['drugB'] & { displayName: string };
}

export default function InteractionChecker({ initialDrugList, onClearInitialList }: InteractionCheckerProps) {
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [drugInput, setDrugInput] = useState('');
  const [suggestions, setSuggestions] = useState<DrugInfo[]>([]);
  const [rxCuisMap, setRxCuisMap] = useState<{ [drugName: string]: string[] }>({});
  const [interactions, setInteractions] = useState<ExtendedInteractionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiExplanations, setAiExplanations] = useState<AiExplanationMap>({});
  const [isAiEnabled, setIsAiEnabled] = useState(false);

  // Sync with key state
  useEffect(() => {
    setIsAiEnabled(hasGeminiKey());
  }, []);

  // Sync with initial drug passed from catalog search page
  useEffect(() => {
    if (initialDrugList.length > 0) {
      const uniqueNew = initialDrugList.filter(d => !selectedDrugs.includes(d));
      if (uniqueNew.length > 0) {
        const nextDrugs = [...selectedDrugs, ...uniqueNew];
        setSelectedDrugs(nextDrugs);
        resolveCuisAndCheck(nextDrugs);
      }
      onClearInitialList();
    }
  }, [initialDrugList]);

  // Suggestions search logic
  useEffect(() => {
    if (!drugInput.trim()) {
      setSuggestions([]);
      return;
    }
    const clean = drugInput.trim().toLowerCase();
    const filtered = NIGERIAN_DRUGS_DATABASE.filter(d =>
      d.name.toLowerCase().includes(clean) ||
      d.genericName.toLowerCase().includes(clean) ||
      d.localBrands.some(b => b.toLowerCase().includes(clean))
    ).slice(0, 5);
    setSuggestions(filtered);
  }, [drugInput]);

  const handleAddDrug = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || selectedDrugs.includes(trimmed)) {
      setDrugInput('');
      setSuggestions([]);
      return;
    }

    const nextDrugs = [...selectedDrugs, trimmed];
    setSelectedDrugs(nextDrugs);
    setDrugInput('');
    setSuggestions([]);
    
    resolveCuisAndCheck(nextDrugs);
  };

  const handleRemoveDrug = (index: number) => {
    const nextDrugs = [...selectedDrugs];
    const removedName = nextDrugs.splice(index, 1)[0];
    setSelectedDrugs(nextDrugs);
    
    const nextMap = { ...rxCuisMap };
    delete nextMap[removedName];
    setRxCuisMap(nextMap);

    if (nextDrugs.length < 2) {
      setInteractions([]);
    } else {
      runCheck(nextMap, nextDrugs);
    }
  };

  const resolveCuisAndCheck = async (drugs: string[]) => {
    setIsLoading(true);
    const updatedMap = { ...rxCuisMap };

    // Resolve CUIs for drugs that don't have them in map yet
    await Promise.all(
      drugs.map(async (drug) => {
        if (!updatedMap[drug]) {
          // Look up active ingredient from local DB first to get scientific names
          const localInfo = lookupDrug(drug);
          const nameToSearch = localInfo ? localInfo.rxNormQuery || localInfo.genericName : drug;
          
          const cuis = await fetchRxCuisForDrug(nameToSearch);
          updatedMap[drug] = cuis;
        }
      })
    );

    setRxCuisMap(updatedMap);
    await runCheck(updatedMap, drugs);
    setIsLoading(false);
  };

  const runCheck = async (cuisMap: { [name: string]: string[] }, drugs: string[]) => {
    if (drugs.length < 2) {
      setInteractions([]);
      return;
    }

    // Collect all active CUIs
    const activeCuis: string[] = [];
    drugs.forEach(d => {
      if (cuisMap[d]) {
        activeCuis.push(...cuisMap[d]);
      }
    });

    if (activeCuis.length < 2) {
      setInteractions([]);
      return;
    }

    const results = await fetchDrugInteractions(activeCuis);
    
    // Cross-reference interaction results with brand name names to label them nicely for the UI
    const formattedResults = results.map(inter => {
      // Find which of our searched drugs mapped to drugA.rxcui and drugB.rxcui
      let matchingDrugA = inter.drugA.name;
      let matchingDrugB = inter.drugB.name;

      for (const [drugName, cuis] of Object.entries(cuisMap)) {
        if (cuis.includes(inter.drugA.rxcui)) {
          matchingDrugA = drugName;
        }
        if (cuis.includes(inter.drugB.rxcui)) {
          matchingDrugB = drugName;
        }
      }

      return {
        ...inter,
        drugA: { ...inter.drugA, displayName: matchingDrugA },
        drugB: { ...inter.drugB, displayName: matchingDrugB },
      };
    });

    setInteractions(formattedResults);
  };

  const fetchAiExplanation = async (idx: number, inter: ExtendedInteractionResult) => {
    const key = `${inter.drugA.displayName}-${inter.drugB.displayName}`;
    
    setAiExplanations(prev => ({
      ...prev,
      [key]: { text: '', loading: true, error: false }
    }));

    try {
      const explanation = await explainInteractionWithAi(
        inter.drugA.displayName,
        inter.drugB.displayName,
        inter.description
      );

      setAiExplanations(prev => ({
        ...prev,
        [key]: { text: explanation, loading: false, error: false }
      }));
    } catch (error) {
      setAiExplanations(prev => ({
        ...prev,
        [key]: { text: '', loading: false, error: true }
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-in">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
          Multi-Drug Interaction Checker
        </h2>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Enter two or more drugs (brands or generics) to check for scientific combination warnings.
        </p>
      </div>

      {/* Input section & Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Input box and checklist */}
        <div className="md:col-span-1 glass-card rounded-3xl p-5 space-y-4 h-fit">
          <h4 className="text-sm font-extrabold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
            Your Checklist
          </h4>

          {/* Add Form */}
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Add drug (e.g., Felvin)..."
                value={drugInput}
                onChange={(e) => setDrugInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-slate-800 dark:text-zinc-100"
              />
              <button
                onClick={() => handleAddDrug(drugInput)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-emerald-500 text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Auto suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 z-30 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                {suggestions.map((drug) => (
                  <button
                    key={drug.id}
                    onClick={() => handleAddDrug(drug.name)}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 flex justify-between font-semibold text-slate-700 dark:text-zinc-300"
                  >
                    <span>{drug.name}</span>
                    <span className="text-slate-400 font-normal">({drug.genericName})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Drugs list */}
          {selectedDrugs.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-zinc-500 italic text-center py-6">
              Your list is empty. Add drugs above to begin checking.
            </p>
          ) : (
            <div className="space-y-2">
              {selectedDrugs.map((drug, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 group transition-all"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800 dark:text-zinc-100">{drug}</span>
                    {rxCuisMap[drug] && rxCuisMap[drug].length === 0 && (
                      <span className="text-[10px] text-amber-500">Unresolved generic CUI (local only)</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveDrug(idx)}
                    className="p-1 rounded-lg text-slate-400 dark:text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Interaction Results panel */}
        <div className="md:col-span-2 space-y-4">
          {isLoading ? (
            <div className="glass-card rounded-3xl p-12 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-zinc-400">
              <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
              <span className="text-sm font-semibold">Consulting scientific interaction databases...</span>
            </div>
          ) : selectedDrugs.length < 2 ? (
            <div className="glass-card rounded-3xl p-12 text-center text-slate-400 dark:text-zinc-500 space-y-2.5">
              <AlertTriangle className="h-10 w-10 text-slate-400 mx-auto" />
              <h5 className="font-bold text-slate-700 dark:text-zinc-300">Add More Drugs</h5>
              <p className="text-xs max-w-sm mx-auto leading-relaxed">
                Add at least two medications to the checklist on the left. The tool will automatically check them against RxNorm databases.
              </p>
            </div>
          ) : interactions.length === 0 ? (
            <div className="border border-emerald-200 dark:border-emerald-900/30 bg-emerald-500/5 rounded-3xl p-8 text-center space-y-3">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto" />
              <div>
                <h4 className="font-bold text-slate-800 dark:text-zinc-100">No Interactions Found</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto mt-1 leading-relaxed">
                  No interactions between these drugs were found in the standard RxNorm scientific registry. 
                  <em> However, safe self-medication is still recommended only after speaking to a healthcare professional.</em>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="h-4.5 w-4.5 text-rose-500" />
                  Found {interactions.length} Interactions
                </h4>
              </div>

              {/* Interaction warning cards */}
              {interactions.map((inter, idx) => {
                const key = `${inter.drugA.displayName}-${inter.drugB.displayName}`;
                const aiExpl = aiExplanations[key];

                return (
                  <div
                    key={idx}
                    className={`rounded-3xl border p-5 space-y-4 transition-all ${
                      inter.severity === 'high'
                        ? 'border-rose-200 dark:border-rose-950/40 bg-rose-500/5 dark:bg-rose-500/10'
                        : inter.severity === 'medium'
                        ? 'border-amber-200 dark:border-amber-950/40 bg-amber-500/5 dark:bg-amber-500/10'
                        : 'border-blue-200 dark:border-blue-950/40 bg-blue-500/5 dark:bg-blue-500/10'
                    }`}
                  >
                    {/* Card Title & severity */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                          inter.severity === 'high'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 animate-pulse'
                            : inter.severity === 'medium'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}>
                          {inter.severity} severity interaction
                        </span>
                        <h4 className="font-bold text-slate-800 dark:text-white mt-1.5 text-base sm:text-lg">
                          {inter.drugA.displayName} + {inter.drugB.displayName}
                        </h4>
                      </div>
                    </div>

                    {/* Scientific details */}
                    <p className="text-slate-600 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed font-medium">
                      {inter.description}
                    </p>

                    {/* AI explanation segment */}
                    {isAiEnabled ? (
                      <div className="border-t border-slate-200/50 dark:border-zinc-800/50 pt-4 mt-2">
                        {!aiExpl ? (
                          <button
                            onClick={() => fetchAiExplanation(idx, inter)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-xs shadow-md shadow-emerald-500/10 transition-all cursor-pointer"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            Explain with AI Pharmacist
                          </button>
                        ) : aiExpl.loading ? (
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                            <RefreshCw className="h-4 w-4 text-emerald-500 animate-spin" />
                            <span>Translating to plain English and Pidgin...</span>
                          </div>
                        ) : aiExpl.error ? (
                          <div className="flex items-center gap-1.5 text-xs text-rose-500">
                            <MessageCircleWarning className="h-4 w-4" />
                            <span>AI Translate Failed. Check connection/key.</span>
                            <button 
                              onClick={() => fetchAiExplanation(idx, inter)}
                              className="underline font-bold"
                            >
                              Retry
                            </button>
                          </div>
                        ) : (
                          <div className="bg-white/60 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-900 rounded-2xl p-4 text-xs sm:text-sm space-y-2.5 animate-slide-in">
                            <h5 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <Sparkles className="h-3.5 w-3.5" />
                              AI Pharmacist Interpretation:
                            </h5>
                            <div className="text-slate-800 dark:text-zinc-200 space-y-2 whitespace-pre-line leading-relaxed font-medium">
                              {aiExpl.text}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="border-t border-slate-200/30 dark:border-zinc-800/30 pt-3 mt-2 text-xs text-slate-500 dark:text-zinc-500 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        <span>Add a Gemini API Key in Settings to get plain-language explanation and Pidgin advice.</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
