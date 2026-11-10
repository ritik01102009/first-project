"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function InputArea({
  onSend,
  disabled,
}: {
  onSend: (content: string) => void;
  disabled: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const send = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const autoHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  return (
    <div className="border-t border-slate-200 dark:border-slate-800 bg-background/90 backdrop-blur px-6 pb-4 pt-3">
      <div className="flex items-end gap-3 max-w-md mx-auto">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            autoHeight();
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Message Otari..."
          className="flex-1 resize-none py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none border border-transparent focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500 transition-all min-h-[44px] max-h-[200px] text-sm"
          rows={1}
        />
        <button
          onClick={send}
          disabled={disabled || !value.trim()}
          className={`p-2.5 rounded-xl text-white transition-all active:scale-95 ${
            value.trim() && !disabled
              ? "bg-blue-600 shadow-lg shadow-blue-500/40 hover:bg-blue-700"
              : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
          }`}
          aria-label="Send message"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
      <p className="text-[10px] text-slate-400 mt-1 max-w-md mx-auto">
        Streaming responses powered by Mozilla Otari Gateway
      </p>
    </div>
  );
}
