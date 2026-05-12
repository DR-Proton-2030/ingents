import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ taskId: string; userId: string }> }
) {
  try {
    const { taskId, userId } = await params;
    const cookies = req.headers.get("cookie") || "";

    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/tasks/unassign/${taskId}/${userId}`,
      {
        headers: { Cookie: cookies },
        withCredentials: true,
      }
    );

    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Unassign task error:", err.response?.data || err.message);

    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to unassign task" },
      { status: err.response?.status || 500 }
    );
  }
}
