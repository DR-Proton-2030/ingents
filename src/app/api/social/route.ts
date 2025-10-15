import { NextResponse } from "next/server";
import { sessionStore } from "@/lib/sessionStore";
import { generateImageWithGemini } from "@/service/imageGenrate";
import { callGemini } from "@/lib/social/callGemini";
import { detectMediaIntent, interpretIntent } from "@/lib/social/intents";
import { generateMain, tryGenerateImage } from "@/lib/social/generate";

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




// (moved to src/lib/social)

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

      // Map roles: assistant/model -> 'model', otherwise 'user'
      const role = (msg.role === "assistant" || msg.role === "model") ? "model" : "user";
      contents.push({ role, parts: [{ text: textPart }] });
    }

    // Fix 3: Removed the explicit appending of the latest user prompt,
    // as it's already included in `recent` if `all` is correctly constructed from history and current messages.
    // Fix 4: Removed the empty model turn, as it's not typically required for `generateContent` calls.

  // Step 1: Detect intent using Gemini + fallback
    const intent = await detectMediaIntent(text);
    console.log('Detected intent for session', sessionId, intent);

    // Step 2: Ask Gemini to interpret user's specific goal more deeply
    const intentInterpretationPrompt = `
You are an AI intent interpreter for a social media assistant.
Analyze the user’s message below and determine their *true goal* in plain language.
Return a JSON object with these fields:
{
  "goal": "short sentence about the user's goal (e.g., generate Facebook post, design image, write caption, brainstorm ideas)",
  "confidence": "low" | "medium" | "high",
  "needsConfirmation": true/false
}
User message: "${text.replace(/"/g, '\\"')}"
`;

    let interpretedIntent: { goal: string; confidence: string; needsConfirmation: boolean } | null = null;
    try {
      const replyRaw = await callGemini(undefined, [{ role: "user", parts: [{ text: intentInterpretationPrompt }] }]);
      const jsonMatch = replyRaw.match(/\{[\s\S]*\}/);
      if (jsonMatch) interpretedIntent = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.warn("Intent interpretation failed, using fallback:", e);
    }

    // Step 3: Handle low-confidence or unclear intent
    if (!interpretedIntent || interpretedIntent.needsConfirmation || interpretedIntent.confidence === "low") {
      const clarifyReply = `I want to make sure I understand. Would you like me to:\n1️⃣ Generate a text post,\n2️⃣ Create an image,\n3️⃣ Make a short video,\nor 4️⃣ Do something else?`;

      const assistantMsg = { role: "assistant", content: clarifyReply };
      sessionStore.updateSession(sessionId, [...all, assistantMsg]);
      return NextResponse.json({ reply: clarifyReply, sessionId });
    }

    // Step 4: Proceed to generation only when intent is clear
    let reply = "";
    let imageUrl: string | null = null;
    let videoUrl: string | null = null;

    // Add intent summary into prompt context
    const intentText = `INTENT: ${JSON.stringify(intent)}, INTERPRETED GOAL: ${interpretedIntent.goal}`;
    const sendContents = [{ role: "user", parts: [{ text: intentText }] }, ...contents];

    // If the quick detect says imageOnly, skip text generation and only produce the image
    if (intent.imageOnly) {
      const imgPrompt = `Generate an image for: ${text}`;
      try {
        imageUrl = await generateImageWithGemini(imgPrompt);
        reply = imageUrl ? "Here's the image I generated for you!" : "I generated the image but couldn't produce a preview.";
      } catch (e) {
        console.error("Image generation failed", e);
        reply = "I attempted to generate the image but something went wrong.";
      }
    } else {
      // Normal flow: generate textual reply first
      try {
        reply = await callGemini(systemInstructionContent, sendContents);
      } catch (e: any) {
        console.error("Gemini call failed, falling back to echo:", e.message);
        reply = `Echo: ${text}`;
      }

      // Generate image/video conditionally after text generation when requested
      if (intent.imageRequested) {
        const imgPrompt = `Generate an image for: ${text}`;
        try {
          imageUrl = await generateImageWithGemini(imgPrompt);
        } catch (e) {
          console.error("Image generation failed", e);
        }
      }

      if (intent.videoRequested || intent.videoOnly) {
        try {
          const { generateVideoWithGemini } = await import("@/service/videoGenrate");
          const vidPrompt = `Generate a short video for: ${text}`;
          videoUrl = await generateVideoWithGemini(vidPrompt);
        } catch (e) {
          console.error("Video generation failed", e);
        }
      }
    }

    // Adjust final reply if media generated
    if (imageUrl) {
      if (!reply || /cannot|unable|can't create/i.test(reply)) {
        reply = "Here's the image I generated for you!";
      } else reply += "";
    }

    if (videoUrl) {
      reply += "\n\n(PS: A short video was generated for this — check below.)";
    }

    // Persist assistant reply (final) including optional imageUrl/videoUrl
    const assistantMsg: any = { role: "assistant", content: reply };
    if (imageUrl) assistantMsg.imageUrl = imageUrl;
    if (videoUrl) assistantMsg.videoUrl = videoUrl;
    sessionStore.updateSession(sessionId, [...all, assistantMsg]);

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
            // After sending textual chunks, append a JSON metadata object so clients
            // reading the stream can pick up sessionId and any generated media (image/video).
            const meta = JSON.stringify({ sessionId, imageUrl, videoUrl });
            controller.enqueue(encoder.encode("\n" + meta));
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
    return NextResponse.json({ reply, imageUrl, sessionId });
  } catch (err) {
    console.error("social route error", err);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}