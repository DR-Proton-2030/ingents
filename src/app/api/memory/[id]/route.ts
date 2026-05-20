/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};

/** PUT /api/memory/:id — update a memory's text */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    if (!body?.text?.trim()) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const response = await axios.put(
      `${BACKEND_URL}/api/v1/memory/${id}`,
      { text: body.text.trim() },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("PUT /memory/:id error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to update memory" },
      { status: err.response?.status || 500 }
    );
  }
}

/** DELETE /api/memory/:id — delete a memory */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const response = await axios.delete(`${BACKEND_URL}/api/v1/memory/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("DELETE /memory/:id error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to delete memory" },
      { status: err.response?.status || 500 }
    );
  }
}
