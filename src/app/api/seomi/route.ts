/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

type Incoming = {
  context?: string;
  messages?: Array<{ role?: string; content?: string }>; // expecting at least one user message
};

// IMPORTANT: Use environment variables for your API key in production!
// Create a file named .env.local in your project root with:
// GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || "AIzaSyCDSQvs_QC5EK6bEwWT2v-xN9eKrsPg_9M";

// --- FIX STARTS HERE ---
// The previous endpoint was for a text-only model or an older version.
// For Gemini 1.5 Flash (which handles both text input and output, and is generally preferred for chat),
// the correct endpoint typically uses the 'generateContent' method.
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
// --- FIX ENDS HERE ---

export async function POST(req: Request) {
  try {
    const body: Incoming = await req.json().catch(() => ({} as Incoming));

    if (
      !body ||
      !body.messages ||
      !Array.isArray(body.messages) ||
      body.messages.length === 0
    ) {
      return NextResponse.json(
        { message: "Missing messages in request" },
        { status: 400 }
      );
    }

    const context = (body.context || "").trim();
    // build a simple prompt: context followed by the last user message
    const last = body.messages[body.messages.length - 1];
    const userText = (last && last.content) || "";

    if (!userText.trim()) {
      return NextResponse.json(
        { message: "Empty user message" },
        { status: 400 }
      );
    }

    // --- PROMPT ADJUSTMENT FOR generateContent API ---
    // The generateContent endpoint expects a different structure for its request body,
    // where prompt parts are sent as 'contents' in a 'parts' array.
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> =
      [];

    // If there's a context, add it as an "user" part (or system if you prefer, but user works for context setting)
    // and then the assistant can "reply" to it. For this simple chat, we'll keep it as a combined user input.
    let fullUserContent = "";
    if (context) {
      fullUserContent += `CONTEXT:\n${context}\n\n`;
    }
    fullUserContent += `USER:\n${userText}`;

    contents.push({
      role: "user",
      parts: [{ text: fullUserContent }],
    });
    // Add an empty assistant part to hint that we expect an assistant response next
    contents.push({
      role: "model", // Gemini uses 'model' for the AI's role in generateContent
      parts: [{ text: "" }],
    });
    // --- END PROMPT ADJUSTMENT ---

    // Call Gemini / Generative Language API
    const resp = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // --- BODY ADJUSTMENT FOR generateContent API ---
        contents: contents, // Use the new 'contents' structure
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 812,
        },
        // --- END BODY ADJUSTMENT ---
      }),
    }).catch((err) => {
      console.error("Network error calling Gemini endpoint:", err);
      throw err;
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "(no body)");
      console.error(`Gemini API error ${resp.status}: ${text}`);
      return NextResponse.json(
        { message: "Gemini API error", status: resp.status, body: text },
        { status: 502 }
      );
    }

    const data = await resp.json().catch(async (err) => {
      const t = await resp.text().catch(() => "(unreadable body)");
      console.error("Failed to parse Gemini JSON:", err, t);
      throw new Error("Invalid JSON from Gemini API");
    });

    // --- REPLY EXTRACTION FOR generateContent API ---
    let reply = "";
    if (data.candidates && data.candidates.length > 0) {
      const firstCandidate = data.candidates[0];
      if (
        firstCandidate.content &&
        firstCandidate.content.parts &&
        firstCandidate.content.parts.length > 0
      ) {
        reply = firstCandidate.content.parts.map((p: any) => p.text).join("\n");
      }
    }
    // If no reply, fallback to stringifying the data for debugging
    if (!reply) {
      reply = JSON.stringify(data, null, 2); // Pretty print for debugging
      console.warn(
        "Could not extract reply from Gemini response, full data:",
        data
      );
    }
    // --- END REPLY EXTRACTION ---

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error("/api/gemini error:", err);
    const message = err instanceof Error ? err.message : "Unknown server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export const runtime = "edge";
