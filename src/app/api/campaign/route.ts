import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  try {
    const cookies = req.headers.get("cookie") || "";
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/campaign`,
      {
        params: Object.fromEntries(searchParams.entries()),
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookies,
        },
        withCredentials: true,
      }
    );
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Backend API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to fetch campaigns" },
      { status: err.response?.status || 500 }
    );
  }
}
