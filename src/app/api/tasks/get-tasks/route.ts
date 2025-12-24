/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8989";

export async function GET(req: Request) {
  // const { searchParams } = new URL(req.url);
  try {
    // Extract cookies from the incoming request
    const cookies = req.headers.get("cookie") || "";
    
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/tasks/get-tasks`,
      {
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookies, // Forward cookies to backend
        },
        withCredentials: true, // Important for cookie handling
      }
    );
    console.log("response from fetch profile back", response);
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Backend API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to fetch user profile" },
      { status: err.response?.status || 500 }
    );
  }
}
