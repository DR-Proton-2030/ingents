export async function callGemini(
  systemInstruction: string | undefined,
  contents: Array<{ role: string; parts: Array<{ text: string }> }>
): Promise<string> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
  const GEMINI_ENDPOINT = GEMINI_API_KEY
    ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`
    : null;

  if (!GEMINI_ENDPOINT) throw new Error("Missing GEMINI_API_KEY");

  const reqContents = [...contents];
  if (systemInstruction) {
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
