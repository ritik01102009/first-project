import { config } from "dotenv";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

config({ path: path.resolve(process.cwd(), ".env") });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3001);
const OTARI_BASE_URL = process.env.OTARI_BASE_URL || "http://localhost:8000";
const OTARI_API_KEY = process.env.OTARI_API_KEY;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

if (!OTARI_API_KEY) {
  console.warn(
    "[WARN] OTARI_API_KEY is not set. Chat requests to Otari will fail until configured."
  );
}

// ---- JSON-file "database" ----
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const DB_FILE = path.join(dataDir, "conversations.json");

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) return { conversations: [], messages: {} };
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch {
    return { conversations: [], messages: {} };
  }
}

function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

const crypto = await import("crypto");
const generateId = () => crypto.randomUUID();
const now = () => Date.now();

// ---- Local model fallback (works with no Otari gateway configured) ----
const LOCAL_MODEL_ID = "local:fallback";

const LOCAL_REPLIES = [
  "I'm running in local fallback mode. The Otari gateway isn't reachable, so I'm answering from a built-in model. Configure OTARI_BASE_URL and OTARI_API_KEY to route to a real provider.",
  "That's an interesting question. I'm currently in local fallback mode because no Otari gateway is available. Set up Otari to get real model responses.",
  "I hear you. I'm operating in local fallback mode right now — the Otari gateway isn't configured. Add your Otari API key and gateway URL to .env to use real models.",
  "Thanks for your message. I'm running locally without an Otari gateway, so this is a placeholder response. Configure Otari for actual AI completions.",
];

function pickLocalReply(text) {
  const t = (text || "").toLowerCase();
  if (t.includes("hello") || t.includes("hi ") || t.startsWith("hi") || t.startsWith("hey")) {
    return "Hello! I'm running in local fallback mode because no Otari gateway is configured. Configure OTARI_BASE_URL and OTARI_API_KEY in server/.env to use real models through Mozilla Otari.";
  }
  if (t.includes("help")) {
    return "I'm in local fallback mode. I can chat with you using built-in responses, but for real AI answers you need to configure a Mozilla Otari gateway (OTARI_BASE_URL + OTARI_API_KEY).";
  }
  if (t.includes("model") || t.includes("otari")) {
    return "I'm using the local fallback model (local:fallback). To use real models, run an Otari gateway (Docker Compose or WSL2) and set OTARI_BASE_URL and OTARI_API_KEY.";
  }
  return LOCAL_REPLIES[Math.floor(Math.random() * LOCAL_REPLIES.length)];
}

async function* streamLocalResponse(messages) {
  const lastUser = messages.slice().reverse().find((m) => m.role === "user");
  const reply = pickLocalReply(lastUser ? lastUser.content : "");
  const words = reply.split(/\s+/);
  let acc = "";
  for (const w of words) {
    acc = acc ? acc + " " + w : w;
    yield { type: "delta", content: w + " ", id: generateId() };
    await new Promise((r) => setTimeout(r, 20 + Math.random() * 30));
  }
  yield { type: "done", id: generateId() };
}

// ---- Express app ----
const app = express();

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "2mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// ---- Validation schemas ----
const { z } = await import("zod");

const ChatRequestSchema = z.object({
  conversationId: z.string().optional(),
  model: z.string().min(1),
  messages: z
    .array(
      z.object({ role: z.enum(["user", "assistant", "system"]), content: z.string() })
    )
    .min(1),
  systemPrompt: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive().optional(),
});

const NewConversationSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  model: z.string().min(1),
});

// ---- Routes ----

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", otari: !!OTARI_API_KEY });
});

app.get("/api/conversations", (_req, res) => {
  try {
    const db = readDb();
    const conversations = db.conversations
      .slice()
      .sort((a, b) => b.updatedAt - a.updatedAt);
    res.json({ conversations });
  } catch (err) {
    res.status(500).json({ error: "Failed to load conversations" });
  }
});

app.post("/api/conversations", (req, res) => {
  try {
    const { title, model } = NewConversationSchema.parse(req.body);
    const id = generateId();
    const ts = now();
    const conv = { id, title: title || "New Conversation", model, createdAt: ts, updatedAt: ts };
    const db = readDb();
    db.conversations.push(conv);
    db.messages[id] = [];
    writeDb(db);
    res.status(201).json(conv);
  } catch (err) {
    res.status(400).json({ error: err instanceof z.ZodError ? err.errors : "Invalid request" });
  }
});

app.get("/api/conversations/:id", (req, res) => {
  try {
    const db = readDb();
    const conv = db.conversations.find((c) => c.id === req.params.id);
    if (!conv) return res.status(404).json({ error: "Conversation not found" });
    const messages = db.messages[req.params.id] || [];
    res.json({ conversation: conv, messages });
  } catch (err) {
    res.status(500).json({ error: "Failed to load conversation" });
  }
});

app.delete("/api/conversations/:id", (req, res) => {
  try {
    const db = readDb();
    const idx = db.conversations.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Conversation not found" });
    db.conversations.splice(idx, 1);
    delete db.messages[req.params.id];
    writeDb(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

app.patch("/api/conversations/:id", (req, res) => {
  try {
    const { title } = z.object({ title: z.string().min(1).max(200) }).parse(req.body);
    const db = readDb();
    const conv = db.conversations.find((c) => c.id === req.params.id);
    if (!conv) return res.status(404).json({ error: "Conversation not found" });
    conv.title = title;
    conv.updatedAt = now();
    writeDb(db);
    res.json({ id: req.params.id, title });
  } catch (err) {
    res.status(400).json({ error: err instanceof z.ZodError ? err.errors : "Invalid request" });
  }
});

app.get("/api/models", async (_req, res) => {
  try {
    const resp = await fetch(`${OTARI_BASE_URL}/api/v1/models`, {
      headers: { "Otari-Key": OTARI_API_KEY },
    });
    if (!resp.ok) {
      throw new Error(`Otari models failed: ${resp.status}`);
    }
    const data = await resp.json();
    res.json({ models: data.data || [] });
  } catch (err) {
    res.status(502).json({ error: "Failed to fetch models from Otari gateway", detail: String(err) });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const parsed = ChatRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }
    const { conversationId, model, messages, systemPrompt, temperature, maxTokens } = parsed.data;

    const otariMessages = [];
    if (systemPrompt) {
      otariMessages.push({ role: "system", content: systemPrompt });
    }
    otariMessages.push(...messages);

    const otariBody = {
      model,
      messages: otariMessages,
      stream: true,
      stream_options: { include_usage: true },
      temperature: temperature ?? 0.7,
      ...(maxTokens ? { max_tokens: maxTokens } : {}),
    };

    // Set SSE headers once, then stream either Otari or the local fallback.
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    let reader;
    let decoder;
    let usedLocal = false;
    let localGenerator;

    const MAX_OTARI_RETRIES = 3;
    let otariResp;
    let lastOtariStatus = null;

    for (let attempt = 0; attempt <= MAX_OTARI_RETRIES; attempt++) {
      try {
        otariResp = await fetch(`${OTARI_BASE_URL}/api/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Otari-Key": OTARI_API_KEY,
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify(otariBody),
          signal: AbortSignal.timeout(120000),
        });

        if (otariResp.ok) {
          lastOtariStatus = null;
          break;
        }

        lastOtariStatus = otariResp.status;

        // Respect rate limit: retry after Retry-After seconds
        if (otariResp.status === 429) {
          const retryAfter = otariResp.headers.get("retry-after");
          const waitMs = retryAfter ? Number(retryAfter) * 1000 : 2000 * (attempt + 1);
          console.warn(`[WARN] Otari rate limited (429). Retrying in ${waitMs}ms (attempt ${attempt + 1}/${MAX_OTARI_RETRIES}).`);
          if (attempt < MAX_OTARI_RETRIES) {
            await new Promise((r) => setTimeout(r, waitMs));
            continue;
          }
        }

        if (OTARI_API_KEY && (otariResp.status === 401 || otariResp.status === 403)) {
          const errText = await otariResp.text().catch(() => "");
          console.warn(`[WARN] Otari returned ${otariResp.status}: ${errText.slice(0, 200)}. Falling back to local model.`);
        } else {
          console.warn(`[WARN] Otari returned ${otariResp.status}. Falling back to local model.`);
        }
        throw new Error(`otari status ${otariResp.status}`);
      } catch (err) {
        if (lastOtariStatus === 429 && attempt < MAX_OTARI_RETRIES) {
          continue;
        }
        usedLocal = true;
        localGenerator = streamLocalResponse(messages);
        break;
      }
    }

    if (otariResp && otariResp.ok) {
      reader = otariResp.body.getReader();
      decoder = new TextDecoder();
    }

    const streamReader = reader || {
      read: async () => {
        const r = await localGenerator.next();
        if (r.done) return { done: true, value: null };
        const chunk = new TextEncoder().encode(`data: ${JSON.stringify(r.value)}\n\n`);
        return { done: false, value: chunk };
      },
      releaseLock: () => {},
    };
    const streamDecoder = decoder || new TextDecoder();
    let assistantContent = "";
    let assistantMessageId = generateId();
    const convId = conversationId || generateId();
    const ts = now();

    if (!conversationId) {
      const db = readDb();
      const newConv = {
        id: convId,
        title: messages[messages.length - 1].content.slice(0, 60) || "New Conversation",
        model: usedLocal ? LOCAL_MODEL_ID : model,
        createdAt: ts,
        updatedAt: ts,
      };
      db.conversations.push(newConv);
      db.messages[convId] = [];
      writeDb(db);
      res.write(`data: ${JSON.stringify({ type: "conversation", id: convId })}\n\n`);
    }

    // Persist user messages
    const db = readDb();
    for (const m of messages) {
      db.messages[convId] = db.messages[convId] || [];
      db.messages[convId].push({ id: generateId(), role: m.role, content: m.content, createdAt: now() });
    }
    writeDb(db);

    try {
      while (true) {
        const { done, value } = await streamReader.read();
        if (done) break;
        const chunk = streamDecoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const choice = parsed.choices?.[0];
            const delta = choice?.delta;
            if (delta?.content) {
              assistantContent += delta.content;
              res.write(`data: ${JSON.stringify({ type: "delta", content: delta.content, id: assistantMessageId })}\n\n`);
            }
            if (choice?.finish_reason) {
              res.write(`data: ${JSON.stringify({ type: "done", id: assistantMessageId })}\n\n`);
            }
          } catch {
            // ignore unparseable lines
          }
        }
      }
    } finally {
      streamReader.releaseLock();
    }

    // Persist assistant message
    const db2 = readDb();
    db2.messages[convId] = db2.messages[convId] || [];
    if (assistantContent) {
      db2.messages[convId].push({ id: assistantMessageId, role: "assistant", content: assistantContent, createdAt: now() });
      const conv = db2.conversations.find((c) => c.id === convId);
      if (conv) {
        conv.title = messages[messages.length - 1].content.slice(0, 60) || "New Conversation";
        conv.model = usedLocal ? LOCAL_MODEL_ID : model;
        conv.updatedAt = now();
      }
    }
    writeDb(db2);

    res.write(`data: ${JSON.stringify({ type: "end", conversationId: convId })}\n\n`);
    res.end();
  } catch (err) {
    if (!res.headersSent) {
      res.status(502).json({ error: "Chat request failed", detail: String(err) });
    } else {
      res.end();
    }
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Otari chatbot server listening on http://localhost:${PORT}`);
  console.log(`Otari gateway: ${OTARI_BASE_URL}`);
});
