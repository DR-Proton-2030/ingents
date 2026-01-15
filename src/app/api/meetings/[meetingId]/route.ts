/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { meetingId } = await params;
    
    // Extract cookies from the incoming request
    const cookies = req.headers.get("cookie") || "";

    const response = await axios.get(
      `${BACKEND_URL}/api/v1/meetings/${meetingId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookies,
        },
        withCredentials: true,
      }
    );
    
    console.log("response from fetch meeting by id", response.data);
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Backend API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to fetch meeting" },
      { status: err.response?.status || 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { meetingId } = await params;
    const body = await req.json();
    
    // Extract cookies from the incoming request
    const cookies = req.headers.get("cookie") || "";

    const response = await axios.patch(
      `${BACKEND_URL}/api/v1/meetings/${meetingId}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookies,
        },
        withCredentials: true,
      }
    );
    
    console.log("response from update meeting", response.data);
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Backend API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to update meeting" },
      { status: err.response?.status || 500 }
    );
  }
}
