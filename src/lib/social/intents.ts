import { callGemini as _callGemini } from "./callGemini";

export function fallbackMediaDetection(userText: string) {
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

export async function detectMediaIntent(userText: string) {
  try {
    const systemInstruction =
      "You are an intent classifier. Analyze the user's request and return ONLY a JSON object with the exact fields:\n{\n  \"imageRequested\": true/false,\n  \"videoRequested\": true/false,\n  \"imageOnly\": true/false,\n  \"videoOnly\": true/false\n}\nRespond with valid JSON only.";

    const reply = await _callGemini(systemInstruction, [{ role: "user", parts: [{ text: `User request: "${userText.replace(/"/g, '\\"')}"` }] }]);
    const jsonMatch = reply.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        imageRequested: Boolean(parsed.imageRequested),
        videoRequested: Boolean(parsed.videoRequested),
        imageOnly: Boolean(parsed.imageOnly),
        videoOnly: Boolean(parsed.videoOnly),
      };
    }
  } catch (e) {
    console.warn("detectMediaIntent helper failed, falling back to regex:", e);
  }
  return fallbackMediaDetection(userText);
}

export async function interpretIntent(userText: string) {
  try {
    const prompt = `You are an AI intent interpreter for a social media assistant. Analyze the user's message and return ONLY a JSON object with fields: {"goal":"...","confidence":"low|medium|high","needsConfirmation": true/false}. User message: "${userText.replace(/"/g, '\\"')}"`;
    const reply = await _callGemini(undefined, [{ role: "user", parts: [{ text: prompt }] }]);
    const jsonMatch = reply.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.warn("interpretIntent failed:", e);
  }
  return null;
}
