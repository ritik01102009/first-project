/**
 * OtariChatbot – a simple floating chat UI.
 * This mimics the Mozilla Otari style: a floating button that expands into a chat panel.
 * It uses a minimal UI (Tailwind) and talks to the Next.js API route `/api/otari-chat`.
 */
import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function OtariChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const toggle = () => setOpen(!open);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    try {
      const res = await fetch("/api/otari-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });
      const data = await res.json();
      const assistantMsg: Message = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      const errMsg: Message = { role: "assistant", content: "Error contacting AI service" };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-vermilion-accent text-on-primary shadow-lg hover:scale-105"
        aria-label="Open Otari Chatbot"
      >
        <span className="material-symbols-outlined text-2xl">smart_toy</span>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-40 w-80 max-h-[70vh] overflow-hidden rounded-lg bg-surface-washi shadow-xl border border-surface-washi-subtle">
          <div className="flex items-center justify-between bg-surface-washi-subtle p-2">
            <h3 className="font-label-md text-ink-charcoal">Otari AI</h3>
            <button onClick={toggle} className="material-symbols-outlined text-ink-charcoal">close</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={
                `flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`
              }>
                <div
                  className={
                    `max-w-xs rounded-lg p-2 text-sm ${
                      msg.role === "assistant"
                        ? "bg-surface-container-low text-ink-charcoal"
                        : "bg-vermilion-accent text-on-primary"
                    }`
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-surface-washi-subtle">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 h-9 rounded border border-surface-container-low bg-surface-washi px-2 text-sm focus:outline-none focus:ring-1 focus:ring-vermilion-accent"
              />
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded bg-vermilion-accent text-on-primary"
              >
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

