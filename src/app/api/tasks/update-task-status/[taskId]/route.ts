/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8989";

export async function PATCH(req: Request, { params }: { params: { taskId: string } }) {
  try {
    const { taskId } = params;

    // Extract cookies from the incoming request
    const cookies = req.headers.get("cookie") || "";

    // Parse request body
    const body = await req.json();

    // Call backend API to update task status
    const response = await axios.patch(
      `${BACKEND_URL}/api/v1/tasks/update-task-status/${taskId}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookies, // Forward cookies to backend
        },
        withCredentials: true,
      }
    );

    console.log("response from update task status:", response.data);
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Backend API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to update task status" },
      { status: err.response?.status || 500 }
    );
  }
}
