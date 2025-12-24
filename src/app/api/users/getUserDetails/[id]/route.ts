/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8989";

interface Params {
  id: string;
}

// GET /api/users/getUser/[id]
export async function GET(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = params; // get id from URL

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }


    const response = await axios.get(`${BACKEND_URL}/api/v1/user/get-user-details/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Important for cookie handling
    });

    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Backend API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to fetch user" },
      { status: err.response?.status || 500 }
    );
  }
}
