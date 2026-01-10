import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ taskId: string; userId: string }> }
) {
  try {
    const { taskId, userId } = await params;

    const cookie = req.headers.get("cookie"); // 🔥 VERY IMPORTANT

    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/v1/tasks/assign/${taskId}/${userId}`,
      {},
      {
        headers: {
          Cookie: cookie || "",
        },
        withCredentials: true,
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("assign task error:", error?.response?.data);

    return NextResponse.json(
      error?.response?.data || { message: "Unauthorized" },
      { status: error?.response?.status || 500 }
    );
  }
}
