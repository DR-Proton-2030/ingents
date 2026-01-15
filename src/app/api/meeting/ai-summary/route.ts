import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript || transcript.length === 0) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert meeting assistant. Below is a transcript of a meeting. 
      Please provide a concise and professional summary in JSON format with the following fields:
      - title: A short, descriptive title for the meeting.
      - keyPoints: An array of the most important points discussed.
      - actionItems: An array of specific tasks or follow-ups identified.
      - sentiment: A brief one-sentence description of the meeting's overall atmosphere.

      Transcript:
      ${transcript}

      Return ONLY valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response text in case Gemini adds markdown backticks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : text;
    
    const summaryData = JSON.parse(jsonString);

    return NextResponse.json(summaryData);
  } catch (error: any) {
    console.error("AI Summary Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate summary" }, { status: 500 });
  }
}
