import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatConfig, Conversation, Message, OtariModel } from "./types";

const DEFAULT_CONFIG: ChatConfig = {
  model: "openai:gpt-4o-mini",
  temperature: 0.7,
  maxTokens: null,
  systemPrompt:
    "You are a helpful, polite, and concise AI assistant. Answer clearly and use markdown formatting where helpful.",
};

interface ChatState {
  // Conversations
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  models: OtariModel[];
  config: ChatConfig;
  isLoadingModels: boolean;
  modelsError: string | null;

  // UI state
  isStreaming: boolean;
  isStopping: boolean;
  theme: "light" | "dark" | "system";
  sidebarOpen: boolean;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  setMessages: (messages: Message[]) => void;
  appendMessage: (message: Message) => void;
  replaceLastMessage: (message: Message) => void;
  setStreaming: (streaming: boolean) => void;
  setStopping: (stopping: boolean) => void;
  setModels: (models: OtariModel[]) => void;
  setIsLoadingModels: (loading: boolean) => void;
  setModelsError: (error: string | null) => void;
  setConfig: (config: Partial<ChatConfig>) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setSidebarOpen: (open: boolean) => void;
  addConversation: (conversation: Conversation) => void;
  removeConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      conversations: [],
      activeConversationId: null,
      messages: [],
      models: [],
      config: DEFAULT_CONFIG,
      isLoadingModels: false,
      modelsError: null,
      isStreaming: false,
      isStopping: false,
      theme: "system",
      sidebarOpen: typeof window !== "undefined" && window.innerWidth >= 768,

      setConversations: (conversations) => set({ conversations }),
      setActiveConversation: (id) => set({ activeConversationId: id }),
      setMessages: (messages) => set({ messages }),
      appendMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      replaceLastMessage: (message) =>
        set((state) => {
          const msgs = [...state.messages];
          if (msgs.length > 0) msgs[msgs.length - 1] = message;
          return { messages: msgs };
        }),
      setStreaming: (isStreaming) => set({ isStreaming }),
      setStopping: (isStopping) => set({ isStopping }),
      setModels: (models) => set({ models }),
      setIsLoadingModels: (isLoadingModels) => set({ isLoadingModels }),
      setModelsError: (modelsError) => set({ modelsError }),
      setConfig: (config) =>
        set((state) => ({ config: { ...state.config, ...config } })),
      setTheme: (theme) => set({ theme }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      addConversation: (conversation) =>
        set((state) => ({
          conversations: [conversation, ...state.conversations],
        })),
      removeConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          activeConversationId:
            state.activeConversationId === id ? null : state.activeConversationId,
        })),
      updateConversationTitle: (id, title) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title } : c
          ),
        })),
    }),
    {
      name: "otari-chat-storage",
      partialize: (state) => ({
        config: state.config,
        theme: state.theme,
      }),
    }
  )
);
