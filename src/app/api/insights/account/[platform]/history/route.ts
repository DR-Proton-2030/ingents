import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { searchParams } = new URL(req.url);
  try {
    const { platform } = await params;
    const cookies = req.headers.get("cookie") || "";
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/insights/account/${platform}/history`,
      {
        params: Object.fromEntries(searchParams.entries()),
        headers: { "Content-Type": "application/json", Cookie: cookies },
        withCredentials: true,
      }
    );
    return NextResponse.json(response.data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to fetch account insights" },
      { status: err.response?.status || 500 }
    );
  }
}
