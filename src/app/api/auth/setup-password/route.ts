/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const authorization = req.headers.get("authorization");
    const cookie = req.headers.get("cookie");

    console.log("Received setup password request with body:", body);

    // Forward Authorization header or cookies to backend so it can verify the token.
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    };

    const response = await axios.post(
      `${BACKEND_URL}/api/v1/auth/setup-password`,
      body,
      {
        headers,
        withCredentials: true,
      }
    );

    console.log("response from setup password:", response.data);
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error("Backend API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to setup password" },
      { status: err.response?.status || 500 }
    );
  }
}
