/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  try {
    // Extract cookies from the incoming request
    const cookies = req.headers.get("cookie") || "";
    
    // Build query params
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const from_date = searchParams.get("from_date") || "";
    const to_date = searchParams.get("to_date") || "";

    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(from_date && { from_date }),
      ...(to_date && { to_date }),
    });

    const response = await axios.get(
      `${BACKEND_URL}/api/v1/meetings?${queryParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookies,
        },
        withCredentials: true,
      }
    );
    
    console.log("response from fetch meetings", response.data);
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Backend API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to fetch meetings" },
      { status: err.response?.status || 500 }
    );
  }
}
