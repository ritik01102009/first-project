"use client";

import React, { useState } from "react";
import { X, Crown, Check } from "lucide-react";

export function PremiumModal() {
  const [show, setShow] = useState(false);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl">
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 mb-3">
          <Crown className="w-6 h-6 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Pro Features</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Everything in this website is 100% free and client-side. No payments or backend required!
        </p>
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            All premium calculators & PDF tools are fully unlocked.
          </span>
        </div>
      </div>
    </div>
  );
}

export default PremiumModal;
