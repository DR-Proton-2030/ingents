import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const weeks = searchParams.get("weeks") || "6";

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `${BACKEND_URL}/api/v1/insights/weekly-engagement`,
      { params: { userId, weeks } }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[Proxy] weekly-engagement error:", error.message);
    return NextResponse.json(
      { success: false, message: error.response?.data?.message || error.message },
      { status: error.response?.status || 500 }
    );
  }
}
