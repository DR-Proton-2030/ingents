/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, videoId } = body;

    if (!userId || !videoId) {
      return NextResponse.json(
        { error: "Missing userId or videoId" },
        { status: 400 }
      );
    }

    console.log(`Fetching YouTube video analytics for videoId: ${videoId}, userId: ${userId}`);
    
    // Using the path provided by the user: /api/v1/youtube/video/analytics
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/youtube/video/analytics`,
      { userId, videoId },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    return NextResponse.json(response.data);
  } catch (err: any) {
    const errorData = err.response?.data;
    console.error("YouTube Video Analytics API Route Error:", {
      status: err.response?.status,
      data: errorData,
      message: err.message
    });
    
    return NextResponse.json(
      {
        error: errorData?.message || err.message || "Failed to fetch video analytics",
      },
      { status: err.response?.status || 500 }
    );
  }
}
