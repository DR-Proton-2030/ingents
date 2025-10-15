import { callGemini } from "./callGemini";
import { generateImageWithGemini } from "@/service/imageGenrate";

export async function generateMain(systemInstructionContent: string, intentText: string, contents: Array<{ role: string; parts: Array<{ text: string }> }>) {
  const sendContents = [{ role: "user", parts: [{ text: intentText }] }, ...contents];
  return callGemini(systemInstructionContent, sendContents);
}

export async function tryGenerateImage(prompt: string) {
  try {
    return await generateImageWithGemini(prompt);
  } catch (e) {
    console.error("tryGenerateImage failed:", e);
    return null;
  }
}
