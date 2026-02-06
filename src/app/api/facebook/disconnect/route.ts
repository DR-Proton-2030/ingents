/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function POST(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
  } catch (_) {
    body = {};
  }

  const userId = body?.userId || body?.user_id || body?.userID;
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/facebook/disconnect`,
      { userId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    return NextResponse.json(
      {
        error:
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to disconnect Facebook",
      },
      { status: err.response?.status || 500 },
    );
  }
}
