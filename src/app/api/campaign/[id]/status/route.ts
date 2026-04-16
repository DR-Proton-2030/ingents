import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookies = req.headers.get("cookie") || "";
    const body = await req.json();
    
    const response = await axios.patch(
      `${BACKEND_URL}/api/v1/campaign/${id}/status`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookies,
        },
        withCredentials: true,
      }
    );
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Backend API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to update campaign status" },
      { status: err.response?.status || 500 }
    );
  }
}
