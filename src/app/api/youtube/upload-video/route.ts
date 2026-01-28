import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

/**
 * Next.js API Route for YouTube Uploads.
 * Securely proxies the request from the frontend to the backend service.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validation
    if (!body.user_id || !body.videoURL) {
      return NextResponse.json(
        { success: false, message: "Missing user_id or videoURL" },
        { status: 400 }
      );
    }

    
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/youtube/upload-video`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Return Backend Response to Frontend
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data;
    console.error("YouTube Proxy API Error:", errorData || error.message);

    return NextResponse.json(
      {
        success: false,
        message: errorData?.message || "YouTube upload failed at backend",
        error: error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
