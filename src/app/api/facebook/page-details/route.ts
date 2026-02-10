/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const pageId = searchParams.get("pageId");
  const dateRange = searchParams.get("dateRange") || "LAST_28_DAYS";

  if (!userId || !pageId) {
    return NextResponse.json(
      { error: "Missing userId or pageId" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/facebook/page/get-all-details?userId=${userId}&pageId=${pageId}&dateRange=${dateRange}`,
      { timeout: 30000 } // Extended timeout for multiple Graph API calls
    );
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Backend Facebook Details API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to fetch Facebook page details" },
      { status: err.response?.status || 500 }
    );
  }
}
