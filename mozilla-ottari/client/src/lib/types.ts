export type Role = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  model: string;
  createdAt: number;
  updatedAt: number;
}

export interface OtariModel {
  id: string;
  name: string;
  object?: string;
  owned_by?: string;
}

export interface ChatConfig {
  model: string;
  temperature: number;
  maxTokens: number | null;
  systemPrompt: string;
}
