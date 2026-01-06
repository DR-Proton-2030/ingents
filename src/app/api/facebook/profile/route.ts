/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const access_token = searchParams.get("access_token");
  const userId = searchParams.get("userId");
  console.log("==========>", userId);
  if (!access_token && !userId) {
    return NextResponse.json(
      { error: "Missing access_token & userId" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/fa/get-pages?userId=${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log("response from fetch profile back", response);
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Backend API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to fetch user profile" },
      { status: err.response?.status || 500 }
    );
  }
}
