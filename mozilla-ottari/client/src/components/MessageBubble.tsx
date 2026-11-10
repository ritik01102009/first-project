"use client";

import React from "react";
import { useChatStore } from "@/lib/store";
import { MoreVertical } from "lucide-react";

export function MessageBubble({ message }: { message: any }) {
  const { config, setConfig } = useChatStore.getState();
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`flex flex-col gap-1 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex items-center gap-2 px-2 text-[10px] text-slate-400 uppercase tracking-wider mb-1">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Assistant
          </span>
          <span>{config.model.split(":").pop() || config.model}</span>
        </div>
      )}
      <div
        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap break-words ${
          isUser
            ? "bg-blue-600 text-white rounded-tr-none"
            : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
