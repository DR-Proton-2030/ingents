/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8989";

export async function GET(req: Request) {
  try {
    // ✅ extract query from request URL
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { message: "Query is required" },
        { status: 400 }
      );
    }

    // ✅ forward cookies
    const cookies = req.headers.get("cookie") || "";

    // ✅ forward query to backend
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/search-users`,
      {
        params: { query }, // 🔥 THIS WAS MISSING
        headers: {
          "Content-Type": "application/json",
          Cookie: cookies,
        },
        withCredentials: true,
      }
    );

    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Backend API error:", err.response?.data || err.message);

    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to fetch users" },
      { status: err.response?.status || 500 }
    );
  }
}
