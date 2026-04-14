/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(req: Request) {
  try {
    const cookies = req.headers.get("cookie") || "";
    
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/check-attendance`,
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
    console.error("Backend API error [check-attendance]:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || "Failed to check attendance" },
      { status: err.response?.status || 500 }
    );
  }
}
