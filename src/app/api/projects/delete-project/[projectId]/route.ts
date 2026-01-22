/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function DELETE(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const cookies = req.headers.get("cookie") || "";
    const { projectId } = params;
    
    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/projects/delete-project/${projectId}`,
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
    console.error("Backend Project API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to delete project" },
      { status: err.response?.status || 500 }
    );
  }
}
