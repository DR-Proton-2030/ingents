/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const access_token = searchParams.get("access_token");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId" },
      { status: 400 }
    );
  }

  // Use the exact backend URL provided by the user, including the double slash if specified
  const url = `${BACKEND_URL}/api/v1/x//handle/get-all-details?user_id=${userId}`;
  console.log("X Get All Details - Calling Backend URL:", url);

  try {
    const response = await axios.get(
      url,
      {
        headers: {
          "Content-Type": "application/json",
          ...(access_token && { Authorization: `Bearer ${access_token}` }),
        },
      }
    );
    console.log("X Get All Details - Success");
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("X Get All Details - Backend API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to fetch X all details" },
      { status: err.response?.status || 500 }
    );
  }
}
