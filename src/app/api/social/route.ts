import { NextResponse } from "next/server";
import { sessionStore } from "@/lib/sessionStore";
import { generateImageWithGemini } from "@/service/imageGenrate";

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

// Fallback regex-based detection (used if Gemini intent detection fails)
function fallbackMediaDetection(userText: string) {
  const imagePatterns = /\b(image|photo|pic|picture|visual|graphic|artwork|illustration|snapshot|with\s+image)\b/i;
  const videoPatterns = /\b(video|clip|footage|recording|movie|animation|motion|with\s+video)\b/i;
  const imageOnlyPatterns = /\b(generate|create|make|show)\s+(image|photo|pic|picture)\b/i;
  const videoOnlyPatterns = /\b(generate|create|make|show)\s+(video|clip|footage)\b/i;
  const postPatterns = /\b(post|content|draft|share)\b/i;

  const imageRequested = imagePatterns.test(userText);
  const videoRequested = videoPatterns.test(userText);
  const imageOnly = imageOnlyPatterns.test(userText) && !postPatterns.test(userText);
  const videoOnly = videoOnlyPatterns.test(userText) && !postPatterns.test(userText);

  return { imageRequested, videoRequested, imageOnly, videoOnly };
}

// Use Gemini to detect media intent. Returns same shape as fallback.
async function detectMediaIntent(userText: string) {
  if (!GEMINI_ENDPOINT) return fallbackMediaDetection(userText);

  const intentPrompt = `Analyze this user request and return ONLY a JSON object with the fields: {"imageRequested": true/false, "videoRequested": true/false, "imageOnly": true/false, "videoOnly": true/false}.\nUser request: "${userText.replace(/"/g, '\\"')}"`;

  try {
    const resp = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: intentPrompt }] }], generationConfig: { temperature: 0.0, maxOutputTokens: 150 } }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '(no body)');
      console.warn('Intent detection Gemini error', resp.status, text);
      return fallbackMediaDetection(userText);
    }

    const data = await resp.json().catch(async () => {
      const t = await resp.text().catch(() => '(unreadable body)');
      throw new Error('Invalid JSON from Gemini: ' + t);
    });

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = reply.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          imageRequested: Boolean(parsed.imageRequested),
          videoRequested: Boolean(parsed.videoRequested),
          imageOnly: Boolean(parsed.imageOnly),
          videoOnly: Boolean(parsed.videoOnly),
        };
      } catch (e) {
        console.warn('Failed to parse intent JSON, falling back', e);
        return fallbackMediaDetection(userText);
      }
    }

    return fallbackMediaDetection(userText);
  } catch (err) {
    console.warn('Intent detection failed, using fallback', err);
    return fallbackMediaDetection(userText);
  }
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

      // Map roles: assistant/model -> 'model', otherwise 'user'
      const role = (msg.role === "assistant" || msg.role === "model") ? "model" : "user";
      contents.push({ role, parts: [{ text: textPart }] });
    }

    // Fix 3: Removed the explicit appending of the latest user prompt,
    // as it's already included in `recent` if `all` is correctly constructed from history and current messages.
    // Fix 4: Removed the empty model turn, as it's not typically required for `generateContent` calls.

    let reply = "";
    let imageUrl: string | null = null;
    let videoUrl: string | null = null;

    // Detect intent early so it can be used for branching (image/video/etc.)
    const intent = await detectMediaIntent(text);
    console.log('Detected intent for session', sessionId, intent);

    try {
      if (GEMINI_ENDPOINT) {
        // Prepare sendContents: include intent as a prefixed user message so model can react
        const intentText = `INTENT: ${JSON.stringify(intent)}`;
        const sendContents = [{ role: 'user', parts: [{ text: intentText }] }, ...contents];

        // Pass the system instruction content and the prepared conversation history to callGemini
        reply = await callGemini(systemInstructionContent, sendContents);
      } else {
        // Fallback to echo when no key is configured
        reply = `Echo: ${text}`;
      }
    } catch (e: any) {
      console.error("Gemini call failed, falling back to echo:", e?.message || e);
      reply = `Echo: ${text}`;
    }

    // If intent indicates an image, attempt image generation and attach imageUrl
    try {
      if (intent && (intent.imageRequested || intent.imageOnly)) {
        const imgPrompt = `Generate an image for the following content: ${text}`;
        imageUrl = await generateImageWithGemini(imgPrompt);
        if (imageUrl) {
          console.log('Generated image URL for session', sessionId);
        }
      }
    } catch (imgErr) {
      console.error('Image generation failed for session', sessionId, imgErr);
      imageUrl = null;
    }

    // If an image was produced but the model reply refused or didn't acknowledge it,
    // replace/refine the reply so the user sees the image with a friendly line.
    if (imageUrl) {
      const refusalPatterns = [
        /cannot generate images/i,
        /can't create images/i,
        /cannot create images/i,
        /I cannot generate images/i,
        /unable to generate images/i,
        /my capabilities are limited to generating text/i,
      ];
      const hasRefusal = refusalPatterns.some((rx) => rx.test(reply || ""));

      if (!reply || hasRefusal || intent.imageOnly) {
        // Provide a concise, useful message that points to the generated image.
        reply = `Here's the image I generated for you based on your request.`;
      } else {
        // If the assistant gave some text and didn't refuse, optionally append a short note.
        reply = `${reply}\n\n(PS: I've also generated an image for this — see below.)`;
      }
    }

    // If intent indicates video, attempt video generation and attach videoUrl
    try {
      if (intent && (intent.videoRequested || intent.videoOnly)) {
        // dynamic import to avoid loading heavy modules unless needed
        const { generateVideoWithGemini } = await import('@/service/videoGenrate');
        const vidPrompt = `Generate a short video for the following content: ${text}`;
        videoUrl = await generateVideoWithGemini(vidPrompt);
        if (videoUrl) {
          console.log('Generated video URL for session', sessionId);
        }
      }
    } catch (vidErr) {
      console.error('Video generation failed for session', sessionId, vidErr);
      videoUrl = null;
    }

    // Persist assistant reply (final) including optional imageUrl
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