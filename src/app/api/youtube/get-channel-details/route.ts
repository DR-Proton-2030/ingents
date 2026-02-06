/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId" },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching YouTube details for userId: ${userId} from ${BACKEND_URL}`);
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/youtube/channel/get-all-details?user_id=${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("YouTube API Response Status:", response.status);
    
    return NextResponse.json(response.data);
  } catch (err: any) {
    const errorData = err.response?.data;
    console.error("YouTube API Route Error:", {
      status: err.response?.status,
      data: errorData,
      message: err.message
    });
    
    return NextResponse.json(
      {
        error: errorData?.message || err.message || "Failed to fetch youtube channel details",
      },
      { status: err.response?.status || 500 }
    );
  }
}
