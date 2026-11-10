"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useChatStore } from "@/lib/store";
import { API } from "@/lib/api";
import { MessageBubble } from "@/components/MessageBubble";
import { ModelSelector } from "@/components/ModelSelector";
import { InputArea } from "@/components/InputArea";
import { X, RefreshCw, ArrowUp, MoreVertical } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export function ChatArea() {
  const {
    activeConversationId,
    messages,
    isStreaming,
    setStreaming,
    setStopping,
    isStopping,
    config,
    setConfig,
    setMessages,
    appendMessage,
    replaceLastMessage,
    addConversation,
    setActiveConversation,
  } = useChatStore.getState();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  useEffect(() => {
    if (scrollEnabled && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming, scrollEnabled]);

  const loadConversation = useCallback(
    async (id: string) => {
      try {
        const data = await API.getConversation(id);
        setMessages(data.messages || []);
        setActiveConversation(id);
      } catch (err) {
        console.error("Failed to load conversation", err);
      }
    },
    [setMessages, setActiveConversation]
  );

  // Load active conversation
  useEffect(() => {
    if (activeConversationId) {
      loadConversation(activeConversationId);
    } else {
      setMessages([]);
    }
  }, [activeConversationId, loadConversation]);

  const handleStop = () => {
    setStopping(true);
    controllerRef.current?.abort();
  };

  const handleRegenerate = async () => {
    if (!activeConversationId || messages.length === 0) return;
    const lastUserIdx = messages.findLastIndex((m) => m.role === "user");
    if (lastUserIdx === -1) return;
    const userMessage = messages[lastUserIdx];
    // Remove assistant messages after the last user message
    const truncated = messages.filter(
      (m, i) => i <= lastUserIdx || (m.role === "user" && i > lastUserIdx)
    );
    setMessages(truncated);
    setStreaming(true);
    setStopping(false);
    controllerRef.current = API.chatStream(
      {
        conversationId: activeConversationId,
        model: config.model,
        messages: truncated.map((m) => ({ role: m.role, content: m.content })),
        systemPrompt: config.systemPrompt,
        temperature: config.temperature,
        maxTokens: config.maxTokens || undefined,
      },
      (data) => {
        if (data.type === "delta" && data.content) {
          replaceLastMessage({
            id: data.id || uuidv4(),
            role: "assistant",
            content: data.content,
            createdAt: Date.now(),
          });
        }
        if (data.type === "done") {
          setStreaming(false);
          setStopping(false);
        }
      },
      (err) => {
        setStreaming(false);
        setStopping(false);
        replaceLastMessage({
          id: uuidv4(),
          role: "assistant",
          content: `Error: ${err}`,
          createdAt: Date.now(),
        });
      },
      () => {
        scrollEnabled && messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    );
  };

  const handleSend = async (content: string) => {
    if (!content.trim()) return;
    const userId = uuidv4();
    const userMessage = { id: userId, role: "user" as const, content, createdAt: Date.now() };
    appendMessage(userMessage);
    setStreaming(true);
    setStopping(false);

    const optimisticId = uuidv4();
    appendMessage({
      id: optimisticId,
      role: "assistant" as const,
      content: "",
      createdAt: Date.now(),
    });

    const msgs = [...messages, userMessage, { id: optimisticId, role: "assistant" as const, content: "", createdAt: Date.now() }];

    controllerRef.current = API.chatStream(
      {
        conversationId: activeConversationId,
        model: config.model,
        messages: msgs.map((m) => ({ role: m.role, content: m.content })),
        systemPrompt: config.systemPrompt,
        temperature: config.temperature,
        maxTokens: config.maxTokens || undefined,
      },
      (data) => {
        if (data.type === "delta" && data.content) {
          replaceLastMessage({
            id: data.id || optimisticId,
            role: "assistant",
            content: data.content,
            createdAt: Date.now(),
          });
        }
        if (data.type === "done") {
          setStreaming(false);
          setStopping(false);
        }
        if (data.type === "end" && data.conversationId && !activeConversationId) {
          setActiveConversation(data.conversationId);
        }
      },
      (err) => {
        setStreaming(false);
        setStopping(false);
        replaceLastMessage({
          id: optimisticId,
          role: "assistant",
          content: `Error: ${err}`,
          createdAt: Date.now(),
        });
      },
      () => {
        scrollEnabled && messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    );
  };

  if (!activeConversationId && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 dark:text-blue-400">
            <X className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium">Start a new conversation</h3>
          <p className="text-sm max-w-xs text-center">Click "New chat" in the sidebar to begin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-background/80 backdrop-blur">
        <ModelSelector />
        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={isStreaming}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Regenerate response"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleStop}
            disabled={!isStreaming}
            className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
            aria-label="Stop generation"
          >
            <X className="w-5 h-5 fill-rose-500" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4" ref={messagesEndRef}>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isStreaming && (
          <div className="flex flex-col gap-1 animate-typing">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <InputArea onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}
