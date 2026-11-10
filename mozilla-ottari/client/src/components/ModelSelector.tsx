"use client";

import React, { useEffect, useState } from "react";
import { useChatStore } from "@/lib/store";
import { ChevronDown } from "lucide-react";

export function ModelSelector() {
  const { models, config, setConfig, isLoadingModels, modelsError } = useChatStore.getState();
  const [open, setOpen] = useState(false);

  useEffect(() => {}, []);

  if (isLoadingModels) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
        Loading models...
      </div>
    );
  }

  if (modelsError) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-[10px] text-rose-600 dark:text-rose-400">
        {modelsError}
      </div>
    );
  }

  const current = models.find((m) => m.id === config.model) || {
    id: config.model,
    name: config.model.split(":").pop() || config.model,
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-background border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
      >
        <span className="truncate mr-1">{current.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-48 rounded-xl bg-background border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
          <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            Models
          </div>
          <div className="max-h-60 overflow-y-auto">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setConfig({ model: model.id });
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  model.id === config.model
                    ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border-r-2 border-r-blue-600"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {model.id === config.model && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
                <span className="truncate">{model.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
