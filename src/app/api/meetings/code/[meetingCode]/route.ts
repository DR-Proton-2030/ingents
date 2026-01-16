/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ meetingCode: string }> }
) {
  try {
    const { meetingCode } = await params;
    
    // Extract cookies from the incoming request
    const cookies = req.headers.get("cookie") || "";

    const response = await axios.get(
      `${BACKEND_URL}/api/v1/meetings/code/${meetingCode}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookies,
        },
        withCredentials: true,
      }
    );
    
    console.log("✅ Meeting details fetch by code successful:", response.data);
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("❌ Backend API error (fetch by code):", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to fetch meeting by code" },
      { status: err.response?.status || 500 }
    );
  }
}
