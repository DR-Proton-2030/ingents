import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    // Get token from cookies or headers
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || req.cookies.get("token")?.value;

    if (!token) {
      console.log("Verify Token Error: No token provided");
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    // Try both BACKEND_URL and NEXT_PUBLIC_BACKEND_URL
    const baseUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";
    const url = `${baseUrl}/api/v1/auth/verify-token`;

    console.log(`Attempting to verify token at: ${url}`);

    try {
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          timeout: 5000,
        }
      );

      console.log(`✅ Successfully verified token at: ${url}`);
      return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
      console.error(`❌ Failed to connect to backend at ${url}:`, err.response?.data || err.message);
      
      return NextResponse.json(
        {
          message: "Unable to connect to backend service",
          details: err.response?.data?.message || err.message,
          url_attempted: url
        },
        { status: err.response?.status || 503 }
      );
    }

  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Verify token API error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}