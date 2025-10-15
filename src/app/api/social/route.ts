import { NextResponse } from "next/server";
import { sessionStore } from "@/lib/sessionStore";

// Session-aware social API route with Gemini integration
// - Accepts { messages: [{ role, content }], sessionId? }
// - Merges with server-side sessionStore history
// - Calls Gemini generateContent when GEMINI_API_KEY is provided
// - Persists assistant reply to sessionStore and returns { reply, sessionId }

type ChatMessage = { role?: string; content?: string };

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""; // recommend setting GEMINI_API_KEY in .env.local for prod
const GEMINI_ENDPOINT = GEMINI_API_KEY
  ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`
  : null;

export const runtime = "nodejs";

async function callGemini(
  systemInstruction: string | undefined, // optional system instruction
  contents: Array<{ role: string; parts: Array<{ text: string }> }>
): Promise<string> {
  if (!GEMINI_ENDPOINT) throw new Error("Missing GEMINI_API_KEY");

  // Ensure the system instruction is sent as the first contents element (role: 'system')
  const reqContents = [...contents];
  if (systemInstruction) {
    // Gemini generateContent expects roles 'user' or 'model'.
    // Include the system instruction as a 'user' message prefixed so the model sees it as instructions.
    reqContents.unshift({ role: "user", parts: [{ text: `SYSTEM INSTRUCTION:\n${systemInstruction}` }] });
  }

  const requestBody: any = {
    contents: reqContents,
    generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
  };

  const resp = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!resp.ok) {
    const txt = await resp.text().catch(() => "(no body)");
    throw new Error(`Gemini API error ${resp.status}: ${txt}`);
  }

  const data = await resp.json().catch(async (e) => {
    const t = await resp.text().catch(() => "(unreadable body)");
    throw new Error("Invalid JSON from Gemini: " + t);
  });

  if (!data || !data.candidates || data.candidates.length === 0) {
    throw new Error("No candidates returned from Gemini");
  }

  const first = data.candidates[0];
  const parts = first?.content?.parts || [];
  const reply = parts.map((p: any) => p.text || "").join("\n");
  return reply || JSON.stringify(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const messages: ChatMessage[] = body.messages || [];
    const sessionId = body.sessionId || `session_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;

    const history = sessionStore.getSession(sessionId) || [];
    const all = [...history, ...messages]; // Combines previous session history with current incoming messages

    // Find the last user message with content from 'all' for the prompt
    const lastUser = all.slice().reverse().find((m) => m.role === "user" && m.content);
    const text = (lastUser?.content || "").trim();

    if (!text) {
      return NextResponse.json({ message: "Missing user message" }, { status: 400 });
    }

    // Define the system instruction content
    const systemInstructionContent = `You are an AI assistant that drafts social media posts and short replies. Reply concisely (1-3 sentences) unless the user asks for a longer draft. When the user mentions a specific platform (facebook, instagram, linkedin, youtube, twitter), tailor the format and tone appropriately. If asked to generate images/videos, focus on the text draft and note media needs separately. Keep language professional and friendly.`;

    // Keep the last 12 messages from the combined 'all' messages for context.
    // These `recent` messages form the conversation history that Gemini sees.
    const recent = (all || []).slice(-12);

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Map conversation messages into contents in order
    for (const msg of recent) {
      const textPart = (msg.content || "").trim();
      if (!textPart) continue; // Skip empty messages

      // Fix 5: Simplify role mapping
      const role = (msg.role === "user" || msg.role === "user") ? "user" : "user";
      contents.push({ role, parts: [{ text: textPart }] });
    }

    // Fix 3: Removed the explicit appending of the latest user prompt,
    // as it's already included in `recent` if `all` is correctly constructed from history and current messages.
    // Fix 4: Removed the empty model turn, as it's not typically required for `generateContent` calls.

    let reply = "";

    try {
      if (GEMINI_ENDPOINT) {
        // Pass the system instruction content and the prepared conversation history to callGemini
        reply = await callGemini(systemInstructionContent, contents);
      } else {
        // Fallback to echo when no key is configured
        reply = `Echo: ${text}`;
      }
    } catch (e: any) {
      console.error("Gemini call failed, falling back to echo:", e?.message || e);
      reply = `Echo: ${text}`;
    }

    // Persist assistant reply (final)
    sessionStore.updateSession(sessionId, [...all, { role: "assistant", content: reply }]);

    // If client requested streaming, stream the reply in small chunks
    const wantStream = req.headers.get("x-ai-stream") === "1" || req.headers.get("accept") === "text/event-stream";
  if (wantStream) {
      // create a ReadableStream that emits the reply in chunks
      const encoder = new TextEncoder();
      const chunkSize = 60; // chars per chunk
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for (let i = 0; i < reply.length; i += chunkSize) {
              const chunk = reply.slice(i, i + chunkSize);
              controller.enqueue(encoder.encode(chunk));
              // small delay to allow client to show progressive text
              await new Promise((r) => setTimeout(r, 20));
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });

      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    return NextResponse.json({ reply, sessionId });
  } catch (err) {
    console.error("social route error", err);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}