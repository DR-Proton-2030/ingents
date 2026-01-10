/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(req: Request) {
  try {
    // Extract cookies from the incoming request
    // const cookies = req.headers.get("cookie") || "";
    
    // Parse request body
    const body = await req.json();
    const token = req.headers.get("Authorization");

    console.log("Received setup password request with body:", body);
    
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/auth/setup-password`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          // Forward the Authorization header if present
          ...(token ? { Authorization: token } : {}),
        },
        // withCredentials: true, // Important for cookie handling
      }
    );
    console.log("response from setup password:", response.data);
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Backend API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to setup password" },
      { status: err.response?.status || 500 }
    );
  }
}
