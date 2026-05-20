/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

/** PUT /api/profile/memory — save the user's memories array */
export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { memories } = body;

    if (!Array.isArray(memories)) {
      return NextResponse.json(
        { error: "Invalid payload: memories must be an array of strings" },
        { status: 400 }
      );
    }

    const response = await axios.patch(
      `${BACKEND_URL}/api/v1/user/update-user`,
      { memories },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("PUT /profile/memory error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to save memories" },
      { status: err.response?.status || 500 }
    );
  }
}
