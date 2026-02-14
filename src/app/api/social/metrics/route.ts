/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  console.log("userid ", userId);

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/social/metrics?user_id=${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response);
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error(
      "Social Metrics - Backend API error:",
      err.response?.data || err.message,
    );
    return NextResponse.json(
      {
        error: err.response?.data?.message || "Failed to fetch social metrics",
      },
      { status: err.response?.status || 500 },
    );
  }
}
