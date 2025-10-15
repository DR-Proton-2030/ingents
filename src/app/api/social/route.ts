import { NextResponse } from "next/server";
import { sessionStore } from "@/lib/sessionStore";
import { generateImageWithGemini } from "@/service/imageGenrate";
import { callGemini } from "@/lib/social/callGemini";
import { detectMediaIntent, interpretIntent } from "@/lib/social/intents";
import { generateMain, tryGenerateImage } from "@/lib/social/generate";
import { postToFacebookFormData } from '@/service/postGeneration/postGeneration.service';

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

      // Confirmation / regenerate handling: if a pending post exists and user confirms, post it
      const pending = sessionStore.getPending(sessionId);

      // Helper: classify short user replies using Gemini into { action: 'confirm'|'regenerate'|'none' }
      async function classifyConfirmation(userText: string) {
        try {
          const prompt = `You are a short intent classifier. The user replies with a short phrase like 'yes', 'no', 'post it', 'regenerate'. Return ONLY a JSON object with { "action": "confirm" | "regenerate" | "none" } indicating whether the user confirms posting, wants regeneration, or neither. Reply with valid JSON only. User reply: "${userText.replace(/"/g, '\\"')}"`;
          const raw = await callGemini(undefined, [{ role: 'user', parts: [{ text: prompt }] }]);
          const m = raw.match(/\{[\s\S]*\}/);
          if (m) {
            const parsed = JSON.parse(m[0]);
            return parsed.action || 'none';
          }
        } catch (e) {
          console.warn('classifyConfirmation failed, falling back to regex', e);
        }
        // fallback regex
        if (/\b(yes|yep|post it|post|do it|go ahead|go|ok|okay|sure)\b/i.test(userText)) return 'confirm';
        if (/\b(regenerate|try again|redo|make me another|change it|re-generate)\b/i.test(userText)) return 'regenerate';
        return 'none';
      }

      // Retry/backoff poster to our internal facebook/post endpoint
      async function postWithRetries(body: any, attempts = 3) {
        let delay = 500;
        for (let i = 0; i < attempts; i++) {
          try {
            // Prefer using postToFacebookFormData which handles multipart and JSON
            console.debug('[social] posting via postToFacebookFormData', { body });

            // If body.image looks like a data URL or base64, convert to Buffer
            let imageBuffer: Buffer | undefined = undefined;
            let filename: string | undefined = undefined;
            let contentType: string | undefined = undefined;
            if (body.image && typeof body.image === 'string') {
              const dataUrlMatch = body.image.match(/^data:(.+);base64,(.*)$/);
                if (dataUrlMatch) {
                  contentType = dataUrlMatch[1];
                  const b64 = dataUrlMatch[2];
                  imageBuffer = Buffer.from(b64, 'base64');
                  const ext = contentType ? (contentType.split('/')[1] || 'jpg') : 'jpg';
                  filename = 'upload.' + ext;
                } else {
                // If it looks like raw base64 (long string), assume jpeg
                const maybe = body.image.replace(/\s+/g, '');
                if (/^[A-Za-z0-9+/=\r\n]+$/.test(maybe) && maybe.length > 100) {
                  imageBuffer = Buffer.from(maybe, 'base64');
                  filename = 'upload.jpg';
                  contentType = 'image/jpeg';
                }
              }
            }

            const fbArgs: any = {
              userId: body.userId,
              pageId: body.pageId,
              message: body.message || body.text || '',
            };
            if (imageBuffer) {
              fbArgs.imageBuffer = imageBuffer;
              fbArgs.filename = filename;
              fbArgs.contentType = contentType;
            }

            const respJson = await postToFacebookFormData(fbArgs as any);
            // postToFacebookFormData returns JSON from backend or an error object
            if (respJson && (respJson.success === false || respJson.ok === false)) {
              console.warn('[social] postToFacebookFormData returned error', respJson);
              return { ok: false, json: respJson };
            }
            return { ok: true, json: respJson };
          } catch (err: any) {
            console.warn(`post attempt ${i+1} failed`, err?.message || err);
            if (i === attempts - 1) return { ok: false, error: err };
            await new Promise((r) => setTimeout(r, delay));
            delay *= 2;
          }
        }
        return { ok: false, error: 'unknown' };
      }

      // Direct command like 'post this'/'post the previous one' should post immediately
      const directPostRegex = /\bpost\s+(?:this|that|it|the\s+(?:previous|last|above|one))\b/i;
      if (directPostRegex.test(text)) {
        // Prefer pending if present, otherwise try to find last assistant message in session
        let effective = pending;
        if (!effective) {
          const sessionMsgs = sessionStore.getSession(sessionId) || [];
          const lastAssistant = sessionMsgs.slice().reverse().find((m: any) => m.role === 'assistant' && (m.content || m.imageUrl || m.videoUrl));
          if (lastAssistant) {
            effective = {
              message: (lastAssistant as any).content || '',
              imageUrl: (lastAssistant as any).imageUrl || null,
              videoUrl: (lastAssistant as any).videoUrl || null,
              userId: '68ef911fd860ee30f6103bdb',
              pageId: '806839612517191',
              platform: 'facebook',
              createdAt: Date.now(),
            } as any;
          }
        }

        if (!effective) {
          const assistantMsg = { role: 'assistant', content: "I couldn't find a recent post to publish. Please generate a post first." };
          sessionStore.updateSession(sessionId, [...all, assistantMsg]);
          return NextResponse.json({ reply: assistantMsg.content, sessionId });
        }

        try {
          const postBody = { userId: effective.userId || '68ef911fd860ee30f6103bdb', pageId: effective.pageId || '806839612517191', message: effective.message, image: effective.imageUrl };
          console.debug('[social] direct post body', { sessionId, postBody });
          const resp = await postWithRetries(postBody, 3);
          // clear pending if it was the source
          if (pending) sessionStore.clearPending(sessionId);
          const successReply = resp.ok && resp.json?.ok ? 'Posted to Facebook successfully.' : `Posting failed: ${resp.error || resp.json?.error || 'unknown'}`;
          console.debug('[social] post response', { sessionId, resp });
          const assistantMsg = { role: 'assistant', content: successReply };
          sessionStore.updateSession(sessionId, [...all, assistantMsg]);
          return NextResponse.json({ reply: successReply, result: resp.json || resp.error, sessionId });
        } catch (err: any) {
          console.error('Error posting to facebook (direct):', err);
          return NextResponse.json({ message: 'Failed to post to Facebook' }, { status: 502 });
        }
      }

      if (pending) {
        const action = await classifyConfirmation(text);
        if (action === 'confirm') {
          try {
            const postBody = { userId: pending.userId || '68ef911fd860ee30f6103bdb', pageId: pending.pageId || '806839612517191', message: pending.message, image: pending.imageUrl };
            console.debug('[social] confirm post body', { sessionId, postBody });
            const resp = await postWithRetries(postBody, 3);
            sessionStore.clearPending(sessionId);
            const successReply = resp.ok && resp.json?.ok ? 'Posted to Facebook successfully.' : `Posting failed: ${resp.error || resp.json?.error || 'unknown'}`;
            console.debug('[social] post response', { sessionId, resp });
            const assistantMsg = { role: 'assistant', content: successReply };
            sessionStore.updateSession(sessionId, [...all, assistantMsg]);
            return NextResponse.json({ reply: successReply, result: resp.json || resp.error, sessionId });
          } catch (err: any) {
            console.error('Error posting to facebook:', err);
            return NextResponse.json({ message: 'Failed to post to Facebook' }, { status: 502 });
          }
        }

        if (action === 'regenerate') {
          sessionStore.clearPending(sessionId);
          const assistantMsg = { role: 'assistant', content: 'Regenerating your post as requested.' };
          sessionStore.updateSession(sessionId, [...all, assistantMsg]);
          // continue to generation flow
        }
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
      // Clean Gemini’s verbose markdown and extract only the real post text
      const cleanGeminiReply = (raw: string) => {
        if (!raw) return "";

        // Remove **Image:** and any [Image: ...] parts
        let text = raw
          .replace(/\*\*Image:\*\*[\s\S]*?(?=\*\*Text:\*\*|$)/gi, "")
          .replace(/\[Image:[^\]]*\]/gi, "")
          .replace(/Here'?s a Facebook post[^:]*:/i, "") // remove intro like "Here's a Facebook post about Diwali:"
          .trim();

        // If Gemini used **Text:** marker, extract only that
        const textMatch = text.match(/\*\*Text:\*\*([\s\S]*)/i);
        if (textMatch) text = textMatch[1].trim();

        // Remove any trailing JSON fragments or accidental duplicates
        text = text.replace(/\{[\s\S]*\}$/g, "").trim();

        return text;
      };

      // Clean the reply for final output
      reply = cleanGeminiReply(reply);
      if (!reply || /cannot|unable|can't create/i.test(reply)) {
        reply = "Here's the image I generated for you!";
      }
    }

    if (videoUrl) {
      reply += "\n\n(PS: A short video was generated for this — check below.)";
    }

    // Persist assistant reply (final) including optional imageUrl/videoUrl
    const assistantMsg: any = { role: "assistant", content: reply };
    if (imageUrl) assistantMsg.imageUrl = imageUrl;
    if (videoUrl) assistantMsg.videoUrl = videoUrl;

  // Determine user/page identifiers from request body or existing session metadata
    const reqUserId = (body && (body.userId || body.user?.id)) || undefined;
    const reqPageId = (body && (body.pageId || body.page?.id)) || undefined;
    const sessionObj = sessionStore.getSessionObject(sessionId) || undefined;
    const sessionUserId = sessionObj && (sessionObj.userId || (sessionObj as any).userId) ? (sessionObj as any).userId : undefined;

    const userIdToUse =  '68ef911fd860ee30f6103bdb';
    const pageIdToUse = '806839612517191'; // keep page optional until real account linking

    // If this generation looked like a post (interpretedIntent.goal contains 'post' or user requested a post), save pendingPost so the user can confirm posting
    // If the user's text explicitly mentions Facebook (regex), force platform to facebook
    const explicitPlatform = /\bfacebook\b|\bfb\b/i.test(text) ? 'facebook' : undefined;

    const pendingPost: any = {
      message: reply,
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null,
      platform: explicitPlatform || (/facebook|fb/i.test(text) ? 'facebook' : undefined),
      userId: userIdToUse,
      pageId: pageIdToUse,
      createdAt: Date.now(),
    };

    // store pendingPost in session for confirmation flow and persist userId on session
    // If the user explicitly asked for Facebook, append a short confirmation question
    if (pendingPost.platform === 'facebook') {
      assistantMsg.content = `${reply}\n\nWould you like me to post this to Facebook now? (yes / no)`;
    }

    sessionStore.updateSession(sessionId, [...all, assistantMsg], userIdToUse);
    sessionStore.setPending(sessionId, pendingPost);

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
    
    console.log("====>ai reply",reply)
    return NextResponse.json({ reply, imageUrl, sessionId });
  } catch (err) {
    console.error("social route error", err);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}