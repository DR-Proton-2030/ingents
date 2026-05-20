/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};

/** GET /api/memory — fetch all memories for the current user */
export async function GET() {
  try {
    const token = await getToken();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const response = await axios.get(`${BACKEND_URL}/api/v1/memory`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("GET /memory error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to fetch memories" },
      { status: err.response?.status || 500 }
    );
  }
}

/** POST /api/memory — create a new memory */
export async function POST(req: Request) {
  try {
    const token = await getToken();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (!body?.text?.trim()) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const response = await axios.post(
      `${BACKEND_URL}/api/v1/memory`,
      { text: body.text.trim() },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json(response.data, { status: 201 });
  } catch (err: any) {
    console.error("POST /memory error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to create memory" },
      { status: err.response?.status || 500 }
    );
  }
}
