"use client";

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Smartphone, HelpCircle, Eye, RefreshCw, Sparkles } from 'lucide-react';

export default function NafdacVerifier() {
  const [scratchRevealed, setScratchRevealed] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [smsLog, setSmsLog] = useState<{ sender: 'user' | '38353'; text: string; time: string }[]>([]);
  const [revealedPin] = useState(() => {
    // Generate a mock code
    const segments = [];
    for (let i = 0; i < 3; i++) {
      segments.push(Math.floor(1000 + Math.random() * 9000).toString());
    }
    return segments.join(' ');
  });

  const handleScratch = () => {
    setScratchRevealed(true);
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode.trim()) return;

    setIsSimulating(true);
    const cleanPin = pinCode.trim().replace(/\s/g, '');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message
    const nextLog = [
      ...smsLog,
      { sender: 'user' as const, text: pinCode, time: now }
    ];
    setSmsLog(nextLog);
    setPinCode('');

    // Simulate network delay for SMS
    setTimeout(() => {
      let reply = '';
      const cleanRevealed = revealedPin.replace(/\s/g, '');

      if (cleanPin === cleanRevealed) {
        reply = `NAFDAC MAS OK: Authentic Emzor Paracetamol. Batch: EM409B. Exp: 09/2028. Mfg by Emzor Pharma Ltd. Thank you for checking.`;
      } else if (cleanPin.length >= 10 && parseInt(cleanPin) % 2 === 0) {
        // Any even digit length 10+ code is simulated as valid for educational demo
        reply = `NAFDAC MAS OK: Authentic Coartem 20/120. Batch: CT8219. Exp: 05/2028. Mfg by Novartis Pharma. Authentic product.`;
      } else {
        reply = `NAFDAC WARNING: Invalid PIN or code already verified! This drug may be COUNTERFEIT. Do not consume. Contact NAFDAC on 0803 310 0610.`;
      }

      setSmsLog([
        ...nextLog,
        { sender: '38353' as const, text: reply, time: now }
      ]);
      setIsSimulating(false);
    }, 1200);
  };

  const handleReset = () => {
    setScratchRevealed(false);
    setSmsLog([]);
    setPinCode('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-in">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white flex items-center justify-center gap-2">
          <ShieldCheck className="h-7 w-7 text-emerald-500" />
          NAFDAC Mobile Authentication Service (MAS) Guide
        </h2>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Learn how to use scratch card PINs to verify authentic medication in Nigeria, and try out our SMS simulator.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Education Guide */}
        <div className="glass-card rounded-3xl p-6 space-y-5">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            How to Verify Genuine Drugs
          </h3>

          <div className="space-y-4 text-sm text-slate-600 dark:text-zinc-300">
            <div className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold flex-shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-slate-800 dark:text-zinc-100">Check for MAS Panel</strong>
                <p className="mt-0.5 text-xs sm:text-sm">
                  Genuine anti-malarials, antibiotics, and other critical medications in Nigeria feature a grey scratch-off panel on the packaging.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold flex-shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-slate-800 dark:text-zinc-100">Scratch to Reveal PIN</strong>
                <p className="mt-0.5 text-xs sm:text-sm">
                  Gently scratch the silver panel with a coin or key to reveal a unique 10 to 12-digit PIN.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold flex-shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-slate-800 dark:text-zinc-100">SMS Free to 38353</strong>
                <p className="mt-0.5 text-xs sm:text-sm">
                  Send the revealed PIN to the shortcode <strong className="text-emerald-500">38353</strong> via SMS. It is 100% free and works on MTN, Airtel, Glo, and 9mobile.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold flex-shrink-0 mt-0.5">
                4
              </span>
              <div>
                <strong className="text-slate-800 dark:text-zinc-100">Read the SMS Status</strong>
                <p className="mt-0.5 text-xs sm:text-sm">
                  You will get an instant response. If it fails or says &ldquo;Invalid Code&rdquo;, do NOT use the drug—return it to the seller or report it to NAFDAC.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-200 text-xs sm:text-sm text-amber-950 dark:text-amber-300 font-semibold space-y-1">
            <h5 className="flex items-center gap-1.5 uppercase font-extrabold tracking-wider text-amber-700 dark:text-amber-400">
              <ShieldAlert className="h-4 w-4" />
              Other Signs of Fake Drugs
            </h5>
            <ul className="list-disc pl-5 space-y-1 mt-1 text-xs">
              <li>Check spelling (e.g. &ldquo;Panadool&rdquo; or typos on package text).</li>
              <li>Ensure the drug packaging contains a clear expiry date, batch number, and NAFDAC registration number (e.g. Reg No: A4-XXXX).</li>
              <li>Buy strictly from registered pharmacies, not street hawkers or open markets.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Simulation Sandbox */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between h-[450px]">
          {/* Top area - scratch simulation */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
              Verification Simulator
            </h4>

            {/* Interactive Scratch card representation */}
            <div className="border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 bg-slate-50 dark:bg-zinc-950 relative overflow-hidden flex flex-col items-center justify-center min-h-[110px] text-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                MAS SCRATCH-OFF PANEL SIMULATION
              </span>
              
              {!scratchRevealed ? (
                <button
                  onClick={handleScratch}
                  className="px-6 py-2 rounded-xl bg-slate-400 dark:bg-zinc-700 hover:bg-slate-500 dark:hover:bg-zinc-600 text-white font-bold text-xs flex items-center gap-1 shadow-md transition-colors cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  Scratch Card Here
                </button>
              ) : (
                <div className="space-y-2 animate-slide-in">
                  <span className="font-mono font-extrabold text-lg sm:text-xl tracking-widest text-emerald-600 dark:text-emerald-400">
                    {revealedPin}
                  </span>
                  <span className="text-[10px] block text-slate-500 dark:text-zinc-400 font-semibold">
                    Send this code to the simulator below
                  </span>
                </div>
              )}

              {scratchRevealed && (
                <button
                  onClick={handleReset}
                  className="absolute bottom-1 right-2 p-1 rounded hover:bg-slate-200 dark:hover:bg-zinc-850 text-slate-400 hover:text-slate-600 transition-colors"
                  title="Reset Scratch Card"
                >
                  <RefreshCw className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Area - Phone Interface SMS simulation */}
          <div className="flex-1 flex flex-col justify-end mt-4">
            <div className="flex-1 border border-slate-200 dark:border-zinc-850 rounded-2xl bg-zinc-100 dark:bg-zinc-950 p-3 overflow-y-auto max-h-[170px] space-y-2 flex flex-col text-xs scrollbar-none">
              {smsLog.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-zinc-500 gap-1.5 italic text-center p-4">
                  <Smartphone className="h-6 w-6 text-slate-350 dark:text-zinc-600" />
                  <span>Your conversation with 38353 will appear here...</span>
                </div>
              ) : (
                smsLog.map((log, idx) => (
                  <div
                    key={idx}
                    className={`max-w-[85%] rounded-2xl p-2.5 flex flex-col gap-1 ${
                      log.sender === 'user'
                        ? 'bg-emerald-500 text-white self-end rounded-br-none'
                        : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 self-start rounded-bl-none'
                    }`}
                  >
                    <p className="leading-normal font-medium">{log.text}</p>
                    <span className="text-[8px] opacity-75 self-end">{log.time}</span>
                  </div>
                ))
              )}
              {isSimulating && (
                <div className="p-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 text-slate-400 self-start flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin text-emerald-500" />
                  <span>38353 is typing...</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendSms} className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Enter 12-digit scratch PIN..."
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-slate-800 dark:text-zinc-100"
              />
              <button
                type="submit"
                disabled={!pinCode.trim() || isSimulating}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-md disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer"
              >
                Send to 38353
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
