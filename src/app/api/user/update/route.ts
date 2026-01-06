/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

export async function PATCH(req: Request) {
  try {
    // Node-safe way to get JSON body
    const bodyText = await req.text();
    const userPayload = JSON.parse(bodyText);

    if (!userPayload) {
      return NextResponse.json(
        { error: "Missing user payload body" },
        { status: 400 }
      );
    }

    // Call your Express backend
    const response = await axios.patch(
      `${BACKEND_URL}/api/v1/user/update-user`,
      userPayload,
      { headers: { "Content-Type": "application/json" } }
    );

    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("Update API error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.message || err.message || "Update failed" },
      { status: err.response?.status || 500 }
    );
  }
}
