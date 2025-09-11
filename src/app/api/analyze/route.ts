import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("/api/analyze received body:", JSON.stringify(body));

    // Basic validation
    if (
      !body ||
      typeof body.target_url !== "string" ||
      !body.target_url.trim()
    ) {
      return NextResponse.json(
        { message: "Missing target_url" },
        { status: 400 }
      );
    }
    if (
      !body ||
      typeof body.main_keyword !== "string" ||
      !body.main_keyword.trim()
    ) {
      return NextResponse.json(
        { message: "Missing main_keyword" },
        { status: 400 }
      );
    }

    // Hardcoded API keys as required
    const payload = {
      gemini_key: "AIzaSyCDSQvs_QC5EK6bEwWT2v-xN9eKrsPg_9M",
      pagespeed_key: "AIzaSyBULc1RjK4BJWYUjza15E6iS76J2NfhFgg",
      serpapi_key:
        "35d523ff82c48250dd6d95370206e304468c6ebcecd983160775d59852cd4a71",
      target_url: body.target_url,
      main_keyword: body.main_keyword,
    };

    // Call backend service with a small fallback: try localhost then 127.0.0.1
    const backendUrls = [
      "http://localhost:5000/analyze",
      "http://127.0.0.1:5000/analyze",
    ];
    let resp: Response | null = null;
    const errors: Array<{
      url: string;
      error: string;
      name?: string;
      code?: string;
    }> = [];

    for (const url of backendUrls) {
      try {
        resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        // if fetch succeeded (even with non-2xx) break and handle below
        break;
      } catch (fetchErr: unknown) {
        const message =
          fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
        const name = fetchErr instanceof Error ? fetchErr.name : undefined;
        const code =
          fetchErr instanceof Error &&
          (fetchErr as unknown as Record<string, unknown>).hasOwnProperty(
            "code"
          )
            ? String((fetchErr as unknown as Record<string, unknown>)["code"])
            : undefined;
        console.error(`Network error when calling backend ${url}:`, fetchErr);
        errors.push({ url, error: message, name, code });
        resp = null;
        // try next url
      }
    }

    if (!resp) {
      return NextResponse.json(
        {
          message: "Failed to reach backend /analyze on any attempted host",
          attempts: errors,
        },
        { status: 502 }
      );
    }

    // If backend returned non-2xx, include its text for debugging
    if (!resp.ok) {
      const text = await resp.text().catch(() => "(no body)");
      console.error(`Backend /analyze returned ${resp.status}: ${text}`);
      return NextResponse.json(
        { message: "Backend error", status: resp.status, body: text },
        { status: 502 }
      );
    }

    // Parse JSON response safely
    let result;
    try {
      result = await resp.json();
    } catch (parseErr) {
      const text = await resp.text().catch(() => "(unreadable body)");
      console.error("Failed to parse backend JSON:", parseErr, text);
      return NextResponse.json(
        { message: "Invalid JSON from backend", body: text },
        { status: 502 }
      );
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    // better debugging info for server logs
    console.error("/api/analyze error:", err);
    const message = err instanceof Error ? err.message : "Unknown server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
