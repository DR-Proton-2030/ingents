import axios from "axios";
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    const pageId = searchParams.get("page_id");
    if (!userId || !pageId) {
      return NextResponse.json(
        { error: "Missing user_id or page_id" },
        { status: 400 },
      );
    }

    const response = await axios.get(
      `${BACKEND_URL}/api/v1/social/sync/facebook?user_id=${encodeURIComponent(userId)}&page_id=${encodeURIComponent(pageId)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Backend API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to sync Facebook data" },
      { status: err.response?.status || 500 },
    );
  }
}
