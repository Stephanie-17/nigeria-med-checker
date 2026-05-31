"use client";

import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertCircle, HeartPulse, RefreshCw, Send, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { hasGeminiKey, analyzeSymptomsWithAi } from '@/lib/gemini';

interface SymptomRuleResult {
  title: string;
  possibilities: string[];
  recommendations: string[];
  redFlags: string[];
  pidginSummary: string;
}

export default function SymptomChecker() {
  const [symptomsInput, setSymptomsInput] = useState('');
  const [isAiEnabled, setIsAiEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // States for outputs
  const [localAnalysis, setLocalAnalysis] = useState<SymptomRuleResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setIsAiEnabled(hasGeminiKey());
  }, []);

  const symptomPresets = [
    {
      label: "Fever + Body Shivering + Headache",
      text: "I have hot body (fever), cold shivering (chills), serious headache, and joint pain."
    },
    {
      label: "Watery Stool + Stomach Pain + Vomiting",
      text: "My stomach is paining me, I have watery toilet (diarrhea), and I am vomiting."
    },
    {
      label: "Dry Cough + Runny Nose + Sore Throat",
      text: "I have dry cough, catarrh, sneezing, and throat pain."
    },
    {
      label: "Stomach Burn + Acid Reflux",
      text: "My chest is burning me, and my stomach hurts, especially before I eat."
    }
  ];

  const handlePresetClick = (text: string) => {
    setSymptomsInput(text);
    setLocalAnalysis(null);
    setAiAnalysis(null);
    setErrorMsg(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomsInput.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setLocalAnalysis(null);
    setAiAnalysis(null);

    if (isAiEnabled) {
      try {
        const res = await analyzeSymptomsWithAi(symptomsInput);
        setAiAnalysis(res);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to analyze symptoms. Falling back to local checker.");
        runLocalRuleChecker(symptomsInput);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Offline/Local rule-based check
      setTimeout(() => {
        runLocalRuleChecker(symptomsInput);
        setIsLoading(false);
      }, 800);
    }
  };

  const runLocalRuleChecker = (text: string) => {
    const lower = text.toLowerCase();
    
    // Rule 1: Malaria / Fever focus
    if (lower.includes('fever') || lower.includes('hot body') || lower.includes('shiver') || lower.includes('chill') || lower.includes('malaria') || lower.includes('headache')) {
      setLocalAnalysis({
        title: "Fever / Malaria / General Infection Triage",
        possibilities: [
          "Malaria (extremely common in Nigeria, transmitted by mosquitoes).",
          "Typhoid Fever (bacterial infection from contaminated food/water).",
          "Viral Illness (like common flu/cold)."
        ],
        recommendations: [
          "Do NOT self-medicate with anti-malarials without checking. Take a Rapid Diagnostic Test (RDT) at a local chemist or laboratory first.",
          "If malaria is confirmed, complete the full 3-day course of Artemether + Lumefantrine (e.g. Coartem, Lonart) with Peak milk or oily food.",
          "Drink plenty of clean water to avoid dehydration."
        ],
        redFlags: [
          "Fever lasting more than 3 days despite taking anti-malarials.",
          "Yellow eyes or dark yellow urine.",
          "Severe vomiting or inability to keep food/drugs down.",
          "Stiff neck or confusion."
        ],
        pidginSummary: "Fever and cold fit be malaria, but e good make you do test first for chemist before you drink drug. If body hot reach 3 days and you dey vomit, run go hospital sharp-sharp!"
      });
      return;
    }

    // Rule 2: Diarrhea / Cholera focus
    if (lower.includes('stool') || lower.includes('diarrhea') || lower.includes('watery') || lower.includes('vomit') || lower.includes('stomach pain') || lower.includes('belly')) {
      setLocalAnalysis({
        title: "Diarrhea / Gastroenteritis Triage",
        possibilities: [
          "Gastroenteritis / Food Poisoning (irritated stomach).",
          "Amoebiasis or Bacterial Infection (from contaminated water or unhygienic food).",
          "Cholera (severe watery diarrhea - check for local outbreaks)."
        ],
        recommendations: [
          "CRITICAL: Start taking Oral Rehydration Salts (ORS) immediately. Mix 1 sachet in 1 liter of clean water, drink it slowly.",
          "If ORS is not available, mix Salt and Sugar Solution (SSS): 6 level teaspoons of sugar and 1/2 level teaspoon of salt in 1 liter of clean water.",
          "Avoid heavy, oily food. Take light meals like pap (ogi) or white rice when vomiting stops.",
          "Do NOT take antibiotics like Flagyl or Tetracycline blindly for every stooling unless prescribed."
        ],
        redFlags: [
          "Blood or black tar in stool.",
          "Sunken eyes, dry mouth, or not urinating (signs of severe dehydration).",
          "Uncontrolled vomiting for more than 12 hours.",
          "Severe, sharp stomach pain that doesn't go away."
        ],
        pidginSummary: "Stooling and vomiting dey dry body quick-quick! Drink ORS or Salt-Sugar Solution immediately. No just drink Flagyl anyhow. If you see blood for toilet or eyes sink, run go see doctor."
      });
      return;
    }

    // Rule 3: Respiratory / Flu focus
    if (lower.includes('cough') || lower.includes('catarrh') || lower.includes('runny nose') || lower.includes('sore throat') || lower.includes('chest') || lower.includes('sneeze')) {
      setLocalAnalysis({
        title: "Respiratory Irritation / Flu Triage",
        possibilities: [
          "Common Cold or Influenza (viral - antibiotics will not work).",
          "Allergic Rhinitis (due to dust, harmattan, or pollen).",
          "Bronchitis or early chest infection."
        ],
        recommendations: [
          "Get plenty of rest and sleep.",
          "Drink warm fluids (warm water, herbal teas, honey and lemon).",
          "Take paracetamol (e.g. Panadol) for body pain or sore throat fever.",
          "Avoid self-medicating with antibiotics (like Amoxil or Ampiclox) for simple colds—they do not kill viruses and destroy your gut health."
        ],
        redFlags: [
          "Difficulty breathing, chest tightness, or wheezing.",
          "Coughing up blood or thick rust-colored phlegm.",
          "High fever that does not go down with paracetamol.",
          "Inability to swallow liquids or breathe when lying flat."
        ],
        pidginSummary: "Cough and catarrh na virus, antibiotic no dey kill am. Drink warm water, rest, and take paracetamol. But if chest dey tight you or you dey cough blood, hospital direct!"
      });
      return;
    }

    // Rule 4: Stomach Burn / Acid
    if (lower.includes('ulcer') || lower.includes('burn') || lower.includes('heartburn') || lower.includes('acid') || lower.includes('gastritis')) {
      setLocalAnalysis({
        title: "Stomach Burn / Suspected Gastritis Triage",
        possibilities: [
          "Hyperacidity or Acid Reflux (heartburn).",
          "Stomach Ulcer (sore in stomach lining).",
          "Gastritis (inflammation of stomach)."
        ],
        recommendations: [
          "Avoid NSAID painkillers like Felvin (Piroxicam), Cataflam (Diclofenac), Ibuprofen, and Aspirin. These will chew your stomach lining and make ulcers bleed.",
          "Take an antacid suspension (like Gaviscon, Gestid, or Actal) after meals to neutralize acid. Space them 2 hours from other drugs.",
          "Avoid spicy foods, pepper, citrus juices, and carbonated soft drinks."
        ],
        redFlags: [
          "Vomiting blood (looks like coffee grounds).",
          "Passing black, tarry, foul-smelling stools (indicates bleeding in stomach).",
          "Severe, sudden, piercing pain in the upper abdomen.",
          "Unexplained weight loss."
        ],
        pidginSummary: "Stomach burn mean say you fit get ulcer. No touch Felvin or Cataflam at all! Dem go tear your stomach. Drink antacid like Gestid, and no eat pepper or drink mineral."
      });
      return;
    }

    // Default general advice
    setLocalAnalysis({
      title: "General Symptoms Triage Guide",
      possibilities: [
        "Undetermined mild health issue.",
        "General stress, dehydration, or exhaustion."
      ],
      recommendations: [
        "Monitor your symptoms closely.",
        "Drink plenty of clean water and rest.",
        "Consult a local pharmacist or visit a primary healthcare center if symptoms do not improve in 24-48 hours."
      ],
      redFlags: [
        "Fever, severe pain, or bleeding.",
        "Fainting or severe dizziness.",
        "Shortness of breath."
      ],
      pidginSummary: "We no fit pin down wetin dey worry you. Rest well, drink water, and monitor the body. If e construct pass 1 day, go check pharmacy or see doctor."
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-in">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white flex items-center justify-center gap-2">
          <HeartPulse className="h-7 w-7 text-emerald-500" />
          Symptom Checker & Triage Guide
        </h2>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Describe your symptoms in plain language to check potential causes and get clear warnings.
        </p>
      </div>

      {/* Warning Box */}
      <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-950/40 bg-amber-500/5 dark:bg-amber-500/10 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed font-semibold">
          <strong>DISCLAIMER:</strong> This is a educational checklist, not a diagnosis. Many diseases in Nigeria share symptoms (like malaria and typhoid). Always get tested.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Search input */}
        <div className="md:col-span-1 space-y-4">
          <div className="glass-card rounded-3xl p-5 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
              Describe Symptoms
            </h4>
            <form onSubmit={handleAnalyze} className="space-y-4">
              <textarea
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                placeholder="E.g., I have been feeling hot since yesterday night, shivering, having headache, and my mouth tastes bitter..."
                rows={5}
                className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 resize-none font-medium"
              />
              <button
                type="submit"
                disabled={!symptomsInput.trim() || isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="h-4.5 w-4.5" />
                    Check Symptoms
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Quick Shortcuts
            </h5>
            <div className="flex flex-col gap-2">
              {symptomPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetClick(preset.text)}
                  className="w-full text-left px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-emerald-500 bg-white dark:bg-zinc-900 text-xs font-semibold text-slate-700 dark:text-zinc-300 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Results Panel */}
        <div className="md:col-span-2 space-y-4">
          {isLoading && (
            <div className="glass-card rounded-3xl p-12 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-zinc-400">
              <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
              <span className="text-sm font-semibold">Running localized clinical triage model...</span>
            </div>
          )}

          {!isLoading && !localAnalysis && !aiAnalysis && (
            <div className="glass-card rounded-3xl p-12 text-center text-slate-400 dark:text-zinc-500 space-y-2.5">
              <AlertCircle className="h-10 w-10 text-slate-400 mx-auto" />
              <h5 className="font-bold text-slate-700 dark:text-zinc-300">Awaiting Input</h5>
              <p className="text-xs max-w-sm mx-auto leading-relaxed">
                Describe your symptoms in the box on the left, or use one of the quick shortcuts to see possible causes and triage guidance.
              </p>
            </div>
          )}

          {/* AI Result View */}
          {!isLoading && aiAnalysis && (
            <div className="glass-card rounded-3xl p-6 space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-zinc-800">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                <h4 className="font-bold text-slate-800 dark:text-white">AI Health Triage Report</h4>
              </div>
              <div className="text-sm text-slate-700 dark:text-zinc-300 space-y-4 whitespace-pre-line leading-relaxed font-medium">
                {aiAnalysis}
              </div>
            </div>
          )}

          {/* Local Rules Result View */}
          {!isLoading && localAnalysis && (
            <div className="space-y-4">
              {/* Status info bar */}
              {errorMsg && (
                <div className="text-xs text-rose-500 font-semibold p-2.5 rounded-xl border border-rose-200/50 bg-rose-50/50 dark:bg-rose-950/20">
                  ⚠️ {errorMsg}
                </div>
              )}
              
              {!isAiEnabled && (
                <div className="text-xs text-slate-500 font-semibold p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                  <span>Configure a Gemini key in settings to unlock deep AI analysis of your symptoms!</span>
                </div>
              )}

              <div className="glass-card rounded-3xl p-6 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    {localAnalysis.title}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                    Rule Analysis
                  </span>
                </div>

                {/* Possibilities */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    Potential Conditions to Watch
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 dark:text-zinc-300">
                    {localAnalysis.possibilities.map((pos, idx) => (
                      <li key={idx} className="font-medium">{pos}</li>
                    ))}
                  </ul>
                </div>

                {/* Action steps */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    Safe Recommended Actions
                  </h4>
                  <div className="space-y-2">
                    {localAnalysis.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex gap-2 text-sm text-slate-700 dark:text-zinc-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="font-medium">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Local Pidgin Tip */}
                <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 space-y-2">
                  <h4 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Pidgin Advisory
                  </h4>
                  <p className="text-emerald-950 dark:text-emerald-200 font-semibold italic text-sm leading-relaxed">
                    💬 &ldquo;{localAnalysis.pidginSummary}&rdquo;
                  </p>
                </div>

                {/* Red Flags warning card */}
                <div className="rounded-2xl border border-rose-200 dark:border-rose-950/40 bg-rose-500/5 dark:bg-rose-500/10 p-5 space-y-3">
                  <h4 className="font-extrabold text-rose-700 dark:text-rose-400 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <ShieldAlert className="h-4.5 w-4.5 text-rose-500 animate-pulse-glow rounded-full" />
                    RED FLAGS &mdash; Go to the clinic if:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-rose-950 dark:text-rose-300 font-semibold">
                    {localAnalysis.redFlags.map((flag, idx) => (
                      <div key={idx} className="flex gap-1.5 items-start">
                        <span className="text-rose-500 font-bold">&#8226;</span>
                        <p className="leading-tight">{flag}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
