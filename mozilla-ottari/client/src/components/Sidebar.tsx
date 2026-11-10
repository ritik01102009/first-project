"use client";

import React, { useEffect, useState } from "react";
import { useChatStore } from "@/lib/store";
import { API } from "@/lib/api";
import { Plus, Menu, X, History, Trash2, Settings } from "lucide-react";

export function Sidebar() {
  const {
    conversations,
    activeConversationId,
    messages,
    sidebarOpen,
    setSidebarOpen,
    setActiveConversation,
    setMessages,
    addConversation,
    removeConversation,
    updateConversationTitle,
    setConversations,
    config,
    setConfig,
  } = useChatStore.getState();

  const [newTitle, setNewTitle] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await API.listConversations();
        setConversations(data.conversations || []);
      } catch (err) {
        console.error("Failed to load conversations", err);
      }
    };
    load();
  }, [setConversations]);

  const handleNewChat = async () => {
    try {
      const data = await API.createConversation({
        model: config.model,
      });
      const conv: any = data;
      addConversation({
        id: conv.id,
        title: conv.title || "New Conversation",
        model: conv.model || config.model,
        createdAt: conv.createdAt || Date.now(),
        updatedAt: conv.updatedAt || Date.now(),
      });
      setActiveConversation(conv.id);
      setMessages([]);
    } catch (err) {
      console.error("Failed to create conversation", err);
    }
  };

  const selectConversation = (id: string, title: string, model: string) => {
    setActiveConversation(id);
    setSidebarOpen(false);
    setConfig({ model });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this conversation?")) return;
    try {
      await API.deleteConversation(id);
      removeConversation(id);
      if (activeConversationId === id) {
        setActiveConversation(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to delete conversation", err);
    }
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-80 border-r border-slate-200 dark:border-slate-800 bg-background/95 backdrop-blur-md transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:w-80 md:border-r md:border-slate-200 dark:md:border-slate-800 shadow-lg`}
      >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-background/50 backdrop-blur">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-500/30">
              <span className="text-[10px]">AI</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Otari Chat</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center gap-2 px-2">
            <button
              onClick={handleNewChat}
              className="flex-1 flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium shadow-lg shadow-blue-500/40 hover:bg-blue-700 transition-all active:scale-95"
            >
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New chat
              </span>
            </button>
          </div>

          <div className="px-2 space-y-1">
            {conversations.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 px-2 py-3 text-center">
                No conversations yet
              </p>
            ) : (
              conversations.map((conv) => {
                const active = conv.id === activeConversationId;
                return (
                  <div
                    key={conv.id}
                    className="group relative"
                  >
                    {renamingId === conv.id ? (
                      <div className="flex gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <input
                          autoFocus
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          onBlur={() => setRenamingId(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newTitle.trim()) {
                              API.renameConversation(conv.id, newTitle.trim()).then(() => {
                                updateConversationTitle(conv.id, newTitle.trim());
                                setRenamingId(null);
                              });
                            }
                            if (e.key === "Escape") setRenamingId(null);
                          }}
                          className="flex-1 bg-transparent text-sm text-foreground outline-none border-b border-blue-500/50 focus:border-blue-500 px-2 py-1"
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => selectConversation(conv.id, conv.title, conv.model)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setRenamingId(conv.id);
                          setNewTitle(conv.title);
                        }}
                        className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                          active
                            ? "bg-blue-600/10 border border-blue-600/30 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-500/10"
                            : "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <History className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                          <span className="truncate font-medium">{conv.title}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(conv.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-md hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Delete conversation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 p-4">
          <button
            onClick={() => setConfig((c) => ({ ...c, systemPrompt: "" }))}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>
    </aside>
    {sidebarOpen && (
      <div
        className="fixed inset-0 z-20 bg-black/30 md:hidden"
        onClick={() => setSidebarOpen(false)}
      ></div>
    )}
    </>
  );
}
