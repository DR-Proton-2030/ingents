/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8989";

export async function POST(req: Request) {
  try {
    // Extract cookies from the incoming request
    const cookies = req.headers.get("cookie") || "";
    
    // Parse request body
    const body = await req.json();
    
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/tasks/create-task`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookies, // Forward cookies to backend
        },
        withCredentials: true, // Important for cookie handling
      }
    );
    console.log("response from create task:", response.data);
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Backend API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to create task" },
      { status: err.response?.status || 500 }
    );
  }
}
