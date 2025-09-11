/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

type Incoming = {
  messages?: Array<{ role?: string; content?: string }>;
};

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || "AIzaSyCDSQvs_QC5EK6bEwWT2v-xN9eKrsPg_9M";

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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

    // Build contents array for Gemini generateContent - no extra context here
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> =
      [];
    const last = body.messages[body.messages.length - 1];
    const userText = (last && last.content) || "";
    if (!userText.trim()) {
      return NextResponse.json(
        { message: "Empty user message" },
        { status: 400 }
      );
    }

    contents.push({ role: "user", parts: [{ text: userText }] });
    contents.push({ role: "model", parts: [{ text: "" }] });

    const resp = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
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

    let reply = "";
    if (data.candidates && data.candidates.length > 0) {
      const first = data.candidates[0];
      if (
        first.content &&
        first.content.parts &&
        first.content.parts.length > 0
      ) {
        reply = first.content.parts.map((p: any) => p.text).join("\n");
      }
    }

    if (!reply) {
      reply = JSON.stringify(data);
    }

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error("/api/social error:", err);
    const message = err instanceof Error ? err.message : "Unknown server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export const runtime = "edge";
