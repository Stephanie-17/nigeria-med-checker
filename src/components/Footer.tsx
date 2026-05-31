import React from 'react';
import { Phone, Heart, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Section 1: Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              Important Medical Disclaimer
            </h4>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
              NaijaMed Checker is an informational guide built to raise drug and symptom awareness in Nigeria. 
              <strong> It is NOT a diagnostic tool, and it is NOT a replacement for a medical doctor.</strong> 
              Never ignore professional medical advice or delay seeking treatment because of something you read here. 
              Always consult a qualified physician or pharmacist.
            </p>
          </div>

          {/* Section 2: Local Help Lines */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-emerald-500" />
              Nigerian Health Emergency lines
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-zinc-400">
              <li className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-zinc-900">
                <span>Nigeria CDC Toll-Free:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">6232</span>
              </li>
              <li className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-zinc-900">
                <span>NAFDAC PR Officer:</span>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">0803 310 0610</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Lagos State Emergency:</span>
                <span className="font-bold text-slate-700 dark:text-zinc-300">767 / 112</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Safe Purchasing */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-teal-500" />
              Anti-Counterfeit Watch
            </h4>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
              Counterfeit medications are a severe health risk. 
              Always purchase from registered pharmacies. Look out for the NAFDAC registration number and verify the mobile authentication scratch card (MAS) code printed on the packaging.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 dark:border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} NaijaMed Checker. Built for safe and informed health decisions.
          </p>
          <p className="text-xs flex items-center gap-1 text-slate-400 dark:text-zinc-500">
            Made with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> in Nigeria for all.
          </p>
        </div>
      </div>
    </footer>
  );
}
