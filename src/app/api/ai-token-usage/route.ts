import { NextRequest, NextResponse } from "next/server";
const BACKEND_URL = "http://localhost:8989";

export async function GET(req: NextRequest) {
  try {
    const cookies = req.headers.get("cookie") || "";
    const response = await fetch(`${BACKEND_URL}/api/v1/ai-token-usage`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
