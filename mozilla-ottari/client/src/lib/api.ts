const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export const API = {
  health: () => fetch(`${API_BASE}/health`).then((r) => r.json()),
  listConversations: () =>
    fetch(`${API_BASE}/conversations`).then((r) => r.json()),
  getConversation: (id: string) =>
    fetch(`${API_BASE}/conversations/${id}`).then((r) => r.json()),
  createConversation: (body: { title?: string; model: string }) =>
    fetch(`${API_BASE}/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  deleteConversation: (id: string) =>
    fetch(`${API_BASE}/conversations/${id}`, { method: "DELETE" }).then((r) =>
      r.json()
    ),
  renameConversation: (id: string, title: string) =>
    fetch(`${API_BASE}/conversations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    }).then((r) => r.json()),
  listModels: () =>
    fetch(`${API_BASE}/models`).then((r) => r.json()),
  chatStream: (
    body: {
      conversationId?: string;
      model: string;
      messages: { role: string; content: string }[];
      systemPrompt?: string;
      temperature?: number;
      maxTokens?: number;
    },
    onMessage: (data: { type: string; content?: string; id?: string; conversationId?: string }) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): AbortController => {
    const controller = new AbortController();
    fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Server error ${res.status}`);
        }
        if (!res.body) throw new Error("No response body");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const pump = async (): Promise<void> => {
          while (true) {
            if (controller.signal.aborted) {
              reader.releaseLock();
              return;
            }
            const { done, value } = await reader.read();
            if (done) {
              reader.releaseLock();
              onEnd();
              return;
            }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                onMessage(parsed);
              } catch {}
            }
          }
        };
        pump().catch((err) => onError(String(err)));
      })
      .catch((err) => {
        onError(String(err));
        onEnd();
      });

    return controller;
  },
};
