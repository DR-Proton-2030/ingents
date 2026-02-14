import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type IncomingBody = {
  context?: string | object | null;
  messages?: Array<{ role?: string; content?: string }>;
  sessionId?: string | null;
};

type BackendResponse = {
  message?: string;
  data?: {
    content?: string;
    files?: string[];
  };
};

function pickMedia(files: string[] | undefined) {
  if (!files || files.length === 0) return { imageUrl: undefined, videoUrl: undefined };

  const isVideo = (url: string) => /\.(mp4|mov|webm|mkv)(\?|#|$)/i.test(url);
  const videoUrl = files.find(isVideo);
  const imageUrl = files.find((url) => !isVideo(url));

  return { imageUrl, videoUrl };
}

function buildMessage(body: IncomingBody) {
  const lastUser = body.messages?.slice().reverse().find((m) => m.role === "user" && m.content);
  const base = (lastUser?.content || "").trim();

  if (!body.context) return base;

  const contextText = typeof body.context === "string" ? body.context : JSON.stringify(body.context);
  if (!contextText.trim()) return base;

  return base ? `${base}\n\nContext:\n${contextText}` : `Context:\n${contextText}`;
}

export async function proxyAssistantRequest(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as IncomingBody;
    const message = buildMessage(body);

    if (!message) {
      return NextResponse.json({ message: "Missing message" }, { status: 400 });
    }

    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";
    const url = `${backendBase.replace(/\/$/, "")}/api/v1/messages/send`;

    const form = new FormData();
    form.append("message", message);
    if (body.sessionId) form.append("chatId", body.sessionId);

    const backendResp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    const text = await backendResp.text();
    let parsed: BackendResponse | null = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }

    if (!backendResp.ok) {
      return NextResponse.json(
        { message: "Backend error", status: backendResp.status, body: parsed ?? text },
        { status: 502 }
      );
    }

    const reply = parsed?.data?.content || parsed?.message || "(no reply)";
    const { imageUrl, videoUrl } = pickMedia(parsed?.data?.files);

    return NextResponse.json({ reply, imageUrl, videoUrl, sessionId: body.sessionId || undefined });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
